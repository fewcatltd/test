import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthToken } from './interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async logIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthToken> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException('Invalid credentials', 401);
    }

    const payload = { id: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
}
