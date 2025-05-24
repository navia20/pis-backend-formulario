import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AlumnoService } from '../alumno/alumno.service';
import { DocenteService } from '../docente/docente.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Alumno, AlumnoSchema } from '../alumno/alumno.schema';
import { Docente, DocenteSchema } from '../docente/docente.schema';
import { getEnvValue } from '../../config/config.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getEnvValue('JWT_SECRET'),
      signOptions: {
        expiresIn: getEnvValue('JWT_EXP'),
        algorithm: getEnvValue('JWT_ALG'),
      },
    }),
    MongooseModule.forFeature([
      { name: Alumno.name, schema: AlumnoSchema },
      { name: Docente.name, schema: DocenteSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AlumnoService, DocenteService],
  exports: [AuthService],
})
export class AuthModule {}