import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';

@Module({
  imports: [ConfigModule, UsersModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
