import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { RpcResponse } from '../../types/rpc-response.interface';
import { UserEntity } from '../../database/entities/user.entity';
import { UserCreateDto } from './dto/user.create.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/limits')
  async getLimit(@Request() req) {
    const limits = await this.userService.getLimits(req.user.id);
    return {
      status: 'success',
      data: limits,
    };
  }

  @Post()
  async createUser(
    @Request() req,
    @Body() userCreateDto: UserCreateDto,
  ): Promise<RpcResponse<UserEntity>> {
    const { email, password } = userCreateDto;
    const user = await this.userService.createUser({ email, password });
    return {
      status: 'success',
      data: user,
    };
  }
}
