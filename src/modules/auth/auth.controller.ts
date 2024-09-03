import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RpcResponse } from '../../types/rpc-response.interface';
import { AuthToken } from './interfaces/auth.interface';
import { AuthGuard } from './auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<RpcResponse<AuthToken>> {
    const { email, password } = loginDto;
    const signInData = await this.authService.logIn({ email, password });
    return {
      status: 'success',
      data: signInData,
    };
  }
  @UseGuards(AuthGuard)
  @Get('/protected-route')
  async protectedRoute(): Promise<RpcResponse<string>> {
    return {
      status: 'success',
      data: 'You are authorized!',
    };
  }
}
