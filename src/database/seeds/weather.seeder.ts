import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { WeatherEntity } from '../entities/weather.entity';

@Injectable()
export class WeatherSeeder {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(WeatherEntity)
    private readonly weatherRepository: Repository<WeatherEntity>,
  ) {}

  async run() {
    const cities = [
      {
        id: 1,
        name: 'Moscow',
      },
      {
        id: 2,
        name: 'London',
      },
      {
        id: 3,
        name: 'Berlin',
      },
      {
        id: 4,
        name: 'New York',
      },
    ];

    await this.cityRepository.save(cities);

    const weathers = [
      {
        cityId: cities[0].id,
        date: '2025-01-01',
        temperature: 25,
      },
      {
        cityId: cities[1].id,
        date: '2025-01-01',
        temperature: 20,
      },
      {
        cityId: cities[2].id,
        date: '2025-01-01',
        temperature: 15,
      },
      {
        cityId: cities[3].id,
        date: '2025-01-01',
        temperature: 30,
      },
    ];

    await this.weatherRepository.save(weathers);
  }
}
