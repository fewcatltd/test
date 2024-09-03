import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthSharedModule } from '../../common/auth-shared.module.ts';

@Module({
  imports: [UsersModule, PassportModule, AuthSharedModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
