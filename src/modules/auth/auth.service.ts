import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AlumnoService } from '../alumno/alumno.service';
import { DocenteService } from '../docente/docente.service';
import { Alumno } from '../alumno/alumno.schema';
import { Docente } from '../docente/docente.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly docenteService: DocenteService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(rut: string, password: string, tipo: 'alumno' | 'docente'): Promise<any> {
    let user;
    if (tipo === 'alumno') {
      user = await this.alumnoService.findByRut(rut);
      if (user && await bcrypt.compare(password, user.contraseña)) {
        return user;
      }
    } else if (tipo === 'docente') {
      user = await this.docenteService.findByRut(rut);
      if (user && await bcrypt.compare(password, user.contraseña)) {
        return user;
      }
    }
    return null;
  }

  async login(user: any): Promise<{ accessToken: string }> {
    const payload = { rut: user.rut, sub: user.id };
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
}