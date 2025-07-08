import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AlumnoService } from '../alumno/alumno.service';
import { DocenteService } from '../docente/docente.service';
import { AdminService } from '../admin/admin.service';
import { Alumno } from '../alumno/alumno.schema';
import { Docente } from '../docente/docente.schema';
import { Admin } from '../admin/admin.schema';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly docenteService: DocenteService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(rut: string, password: string, tipo: 'alumno' | 'docente' | 'admin'): Promise<any> {
    let user;
    console.log('Validando usuario:', { rut, password, tipo });
    if (tipo === 'alumno') {
      user = await this.alumnoService.findByRut(rut);
      console.log('Resultado búsqueda alumno:', user);
      if (user && await bcrypt.compare(password, user.contraseña)) {
        console.log('Contraseña correcta');
        return { ...user.toObject(), tipo: 'alumno' };
      } else {
        console.log('Contraseña incorrecta o usuario no encontrado');
      }
    } else if (tipo === 'docente') {
      user = await this.docenteService.findByRut(rut);
      console.log('Resultado búsqueda docente:', user);
      if (user && await bcrypt.compare(password, user.contraseña)) {
        console.log('Contraseña correcta');
        return { ...user.toObject(), tipo: 'docente' };
      } else {
        console.log('Contraseña incorrecta o usuario no encontrado');
      }
    } else if (tipo === 'admin') {
      user = await this.adminService.findByRut(rut);
      console.log('Resultado búsqueda admin:', user);
      if (user && await bcrypt.compare(password, user.contraseña)) {
        console.log('Contraseña correcta');
        return { ...user.toObject(), tipo: 'admin' };
      } else {
        console.log('Contraseña incorrecta o usuario no encontrado');
      }
    }
    return null;
  }

  async login(user: any): Promise<{ accessToken: string }> {
    console.log('Login - usuario recibido:', user);
    console.log('Login - user.rut:', user.rut);
    console.log('Login - user.id:', user.id);
    
    const payload = { rut: user.rut, sub: user.id };
    console.log('Login - payload creado:', payload);
    
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async registerAlumno(userData: Partial<Alumno>): Promise<Alumno> {
    return this.alumnoService.create(userData);
  }

  async registerDocente(userData: Partial<Docente>): Promise<Docente> {
    return this.docenteService.create(userData);
  }

  async registerAdmin(userData: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(userData);
  }

  async getProfile(rut: string): Promise<any> {
    console.log('getProfile - buscando RUT:', rut);
    
    // Buscar en cada tipo de usuario para encontrar el perfil
    const alumno = await this.alumnoService.findByRut(rut);
    if (alumno) {
      console.log('Encontrado alumno:', alumno);
      const alumnoObj = (alumno as any).toObject ? (alumno as any).toObject() : alumno;
      return { ...alumnoObj, tipo: 'alumno' };
    }

    const docente = await this.docenteService.findByRut(rut);
    if (docente) {
      console.log('Encontrado docente:', docente);
      const docenteObj = (docente as any).toObject ? (docente as any).toObject() : docente;
      return { ...docenteObj, tipo: 'docente' };
    }

    const admin = await this.adminService.findByRut(rut);
    if (admin) {
      console.log('Encontrado admin:', admin);
      const adminObj = (admin as any).toObject ? (admin as any).toObject() : admin;
      return { ...adminObj, tipo: 'admin' };
    }

    console.log('No se encontró usuario para RUT:', rut);
    return null;
  }
}