import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const users = [
      {
        email: 'dokotov@gmail.com',
        password: bcrypt.hashSync('password', 10),
      },
      {
        email: 'dokotov+1@gmail.com',
        password: bcrypt.hashSync('password', 10),
      },
      {
        email: 'dokotov+2@gmail.com',
        password: bcrypt.hashSync('password', 10),
      },
      {
        email: 'dokotov+3@gmail.com',
        password: bcrypt.hashSync('password', 10),
      },
    ];

    await this.userRepository.save(users);
  }
}
