import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  HttpException, 
  HttpStatus, 
  UseGuards,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CargaMasivaService } from './carga-masiva.service';

@Controller('auth')
@UseGuards(AuthGuard('jwt'))
export class CargaMasivaController {
  constructor(private readonly cargaMasivaService: CargaMasivaService) {}

  @Post('cargar-usuarios-excel')
  @UseInterceptors(FileInterceptor('archivo', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.mimetype === 'application/vnd.ms-excel') {
        callback(null, true);
      } else {
        callback(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
      }
    },
  }))
  async cargarUsuariosExcel(
    @UploadedFile() archivo: Express.Multer.File,
    @Body('tipoUsuario') tipoUsuario: 'admin' | 'docente' | 'alumno'
  ) {
    try {
      if (!archivo) {
        throw new HttpException('No se ha proporcionado ningún archivo', HttpStatus.BAD_REQUEST);
      }

      if (!tipoUsuario) {
        throw new HttpException('Debe especificar el tipo de usuario', HttpStatus.BAD_REQUEST);
      }

      console.log('📁 Archivo recibido:', archivo.originalname);
      console.log('📋 Tipo de usuario:', tipoUsuario);
      console.log('📊 Tamaño del archivo:', archivo.size, 'bytes');

      const resultado = await this.cargaMasivaService.procesarArchivoExcel(
        archivo.buffer, 
        tipoUsuario
      );

      return {
        success: true,
        message: 'Usuarios procesados exitosamente',
        ...resultado
      };
    } catch (error) {
      console.error('❌ Error en carga masiva:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error interno del servidor', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('descargar-plantilla')
  async descargarPlantilla(@Body('tipoUsuario') tipoUsuario: 'admin' | 'docente' | 'alumno') {
    try {
      const plantilla = await this.cargaMasivaService.generarPlantillaExcel(tipoUsuario);
      
      return {
        success: true,
        message: 'Plantilla generada exitosamente',
        archivo: plantilla.toString('base64'),
        nombreArchivo: `plantilla_${tipoUsuario}.xlsx`
      };
    } catch (error) {
      console.error('❌ Error al generar plantilla:', error);
      throw new HttpException('Error al generar la plantilla', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
