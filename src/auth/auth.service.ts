import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(rut: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ rut });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { username: user.rut, sub: user.id_user };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(userData: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(userData.password, salt); // Hashea la contraseña
    return this.userRepository.save(userData); // Guarda el usuario en la base de datos
  }
}