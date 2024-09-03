import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserSeeder } from './user.seeder';
import { WeatherSeeder } from './weather.seeder';
import { SeederService } from './seeder.service';
import { WeatherEntity } from '../entities/weather.entity';
import { CityEntity } from '../entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, WeatherEntity, CityEntity])],
  providers: [SeederService, UserSeeder, WeatherSeeder],
  exports: [SeederService],
})
export class SeederModule {}
