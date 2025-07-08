import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alumno } from '../alumno/alumno.schema';
import { Docente } from '../docente/docente.schema';
import { Admin } from '../admin/admin.schema';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

interface CodigoRecuperacion {
  email: string;
  codigo: string;
  intentos: number;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  usado: boolean;
}

interface TokenReset {
  email: string;
  token: string;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  usado: boolean;
}

@Injectable()
export class RecuperarPasswordService {
  private codigosRecuperacion: Map<string, CodigoRecuperacion> = new Map();
  private tokensReset: Map<string, TokenReset> = new Map();

  constructor(
    @InjectModel(Alumno.name) private alumnoModel: Model<Alumno>,
    @InjectModel(Docente.name) private docenteModel: Model<Docente>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private emailService: EmailService,
  ) {}

  async solicitarCodigo(email: string) {
    // Verificar que el usuario existe en alguna de las colecciones
    const usuario = await this.buscarUsuarioPorEmail(email);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar límite de intentos (máximo 3 solicitudes por hora)
    const ahora = new Date();
    const unaHoraAtras = new Date(ahora.getTime() - 60 * 60 * 1000);
    
    const codigoExistente = this.codigosRecuperacion.get(email);
    if (codigoExistente && codigoExistente.fechaCreacion > unaHoraAtras && codigoExistente.intentos >= 3) {
      throw new Error('Demasiados intentos');
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar código (en producción, esto debería estar en base de datos)
    const fechaExpiracion = new Date(ahora.getTime() + 15 * 60 * 1000); // 15 minutos
    
    this.codigosRecuperacion.set(email, {
      email,
      codigo,
      intentos: (codigoExistente?.intentos || 0) + 1,
      fechaCreacion: ahora,
      fechaExpiracion,
      usado: false
    });

    try {
      // Intentar enviar email real
      await this.emailService.enviarCodigoRecuperacion(email, codigo);
      console.log(`✅ Email enviado exitosamente a ${email}`);
    } catch (error) {
      console.error(`❌ Error al enviar email a ${email}:`, error.message);
      // En caso de error, mostrar código en consola como fallback
      console.log(`📧 CÓDIGO DE RECUPERACIÓN PARA ${email}: ${codigo}`);
      console.log(`⏰ Válido hasta: ${fechaExpiracion.toLocaleString()}`);
    }

    return {
      emailEnviado: true,
      validoHasta: fechaExpiracion,
      // Solo para desarrollo - REMOVER EN PRODUCCIÓN
      codigoDesarrollo: process.env.NODE_ENV === 'development' ? codigo : undefined
    };
  }

  async verificarCodigo(email: string, codigo: string) {
    const codigoData = this.codigosRecuperacion.get(email);
    
    if (!codigoData) {
      throw new Error('Código no encontrado');
    }

    if (codigoData.usado) {
      throw new Error('Código ya utilizado');
    }

    if (new Date() > codigoData.fechaExpiracion) {
      throw new Error('Código expirado');
    }

    if (codigoData.codigo !== codigo) {
      throw new Error('Código incorrecto');
    }

    // Marcar código como usado
    codigoData.usado = true;
    this.codigosRecuperacion.set(email, codigoData);

    // Generar token de reset temporal
    const resetToken = crypto.randomBytes(32).toString('hex');
    const fechaExpiracionToken = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    this.tokensReset.set(resetToken, {
      email,
      token: resetToken,
      fechaCreacion: new Date(),
      fechaExpiracion: fechaExpiracionToken,
      usado: false
    });

    return {
      resetToken,
      validoHasta: fechaExpiracionToken
    };
  }

  async cambiarPassword(email: string, token: string, nuevaPassword: string) {
    const tokenData = this.tokensReset.get(token);
    
    if (!tokenData || tokenData.email !== email || new Date() > tokenData.fechaExpiracion || tokenData.usado) {
      throw new Error('Token inválido o expirado');
    }

    // Marcar token como usado
    tokenData.usado = true;
    this.tokensReset.set(token, tokenData);

    // Buscar usuario y cambiar contraseña
    const usuario = await this.buscarUsuarioPorEmail(email);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

    // Actualizar contraseña según el tipo de usuario
    if (usuario.tipo === 'alumno') {
      await this.alumnoModel.updateOne(
        { email },
        { contraseña: hashedPassword }
      );
    } else if (usuario.tipo === 'docente') {
      await this.docenteModel.updateOne(
        { email },
        { contraseña: hashedPassword }
      );
    } else if (usuario.tipo === 'admin') {
      await this.adminModel.updateOne(
        { email },
        { contraseña: hashedPassword }
      );
    }

    console.log(`✅ Contraseña cambiada exitosamente para ${email}`);
    
    // Limpiar datos expirados
    this.limpiarDatosExpirados();
  }

  async cambiarPasswordPerfil(
    usuarioId: string, 
    tipoUsuario: 'admin' | 'docente' | 'alumno',
    passwordActual: string, 
    passwordNueva: string
  ) {
    console.log('🔄 Iniciando cambio de contraseña desde perfil...');
    console.log('📝 Usuario ID recibido:', usuarioId);
    console.log('👤 Tipo Usuario:', tipoUsuario);
    
    let usuario: any = null;
    
    // Buscar usuario según su tipo
    try {
      console.log(`🔍 Buscando usuario ${tipoUsuario} con ID: ${usuarioId}`);
      
      if (tipoUsuario === 'alumno') {
        usuario = await this.alumnoModel.findOne({ id: usuarioId });
        console.log('👨‍🎓 Resultado búsqueda alumno:', !!usuario);
      } else if (tipoUsuario === 'docente') {
        usuario = await this.docenteModel.findOne({ id: usuarioId });
        console.log('👨‍🏫 Resultado búsqueda docente:', !!usuario);
      } else if (tipoUsuario === 'admin') {
        usuario = await this.adminModel.findOne({ id: usuarioId });
        console.log('👨‍💼 Resultado búsqueda admin:', !!usuario);
      }
      
      if (!usuario) {
        console.log('❌ Usuario no encontrado en la base de datos');
        throw new Error('Usuario no encontrado');
      }
      
      console.log('✅ Usuario encontrado:', {
        id: usuario._id,
        email: usuario.email,
        hasContraseña: !!usuario.contraseña
      });
    } catch (error) {
      console.error('❌ Error en búsqueda de usuario:', error);
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    console.log('🔐 Verificando contraseña actual...');
    const isPasswordValid = await bcrypt.compare(passwordActual, usuario.contraseña);
    console.log('🔐 Contraseña actual válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hash de la nueva contraseña
    console.log('🔒 Hasheando nueva contraseña...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordNueva, salt);

    // Actualizar contraseña
    try {
      console.log('💾 Actualizando contraseña en base de datos...');
      
      if (tipoUsuario === 'alumno') {
        await this.alumnoModel.updateOne(
          { id: usuarioId },
          { contraseña: hashedPassword }
        );
      } else if (tipoUsuario === 'docente') {
        await this.docenteModel.updateOne(
          { id: usuarioId },
          { contraseña: hashedPassword }
        );
      } else if (tipoUsuario === 'admin') {
        await this.adminModel.updateOne(
          { id: usuarioId },
          { contraseña: hashedPassword }
        );
      }

      console.log(`✅ Contraseña cambiada exitosamente desde perfil para usuario ${usuarioId} (${tipoUsuario})`);
    } catch (error) {
      console.error('❌ Error al actualizar contraseña:', error);
      throw new Error('Error al cambiar la contraseña');
    }
  }

  private async buscarUsuarioPorEmail(email: string): Promise<any> {
    // Buscar en alumnos
    let usuario: any = await this.alumnoModel.findOne({ email }).exec();
    if (usuario) {
      return { ...usuario.toObject(), tipo: 'alumno' };
    }

    // Buscar en docentes
    usuario = await this.docenteModel.findOne({ email }).exec();
    if (usuario) {
      return { ...usuario.toObject(), tipo: 'docente' };
    }

    // Buscar en admins
    usuario = await this.adminModel.findOne({ email }).exec();
    if (usuario) {
      return { ...usuario.toObject(), tipo: 'admin' };
    }

    return null;
  }

  private limpiarDatosExpirados() {
    const ahora = new Date();
    
    // Limpiar códigos expirados
    for (const [email, codigo] of this.codigosRecuperacion.entries()) {
      if (ahora > codigo.fechaExpiracion || codigo.usado) {
        this.codigosRecuperacion.delete(email);
      }
    }

    // Limpiar tokens expirados
    for (const [token, tokenData] of this.tokensReset.entries()) {
      if (ahora > tokenData.fechaExpiracion || tokenData.usado) {
        this.tokensReset.delete(token);
      }
    }
  }

  // Método para debugging - remover en producción
  getEstadoActual() {
    return {
      codigosActivos: Array.from(this.codigosRecuperacion.entries()),
      tokensActivos: Array.from(this.tokensReset.entries())
    };
  }
}
