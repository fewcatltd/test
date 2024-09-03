import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { cacheKeys } from '../../common/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getLimits(userId: number): Promise<number> {
    const userRequestCountKey = cacheKeys.userWeatherRequestCount(userId);

    return (await this.cacheManager.get<number>(userRequestCountKey)) || 0;
  }

  async createUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserEntity> {
    return await this.userRepository.save({
      email,
      password: await bcrypt.hash(password, 10),
    });
  }
}
