import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherEntity } from '../../database/entities/weather.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { cacheKeys, emailService } from '../../common/constants';
import { CityEntity } from '../../database/entities/city.entity';

@Injectable()
export class WeatherService {
  private readonly userRequestLimit: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(WeatherEntity)
    private readonly weatherRepository: Repository<WeatherEntity>,
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @Inject('EMAIL_AMQP_SERVICE') private client: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.userRequestLimit = this.configService.get<number>(
      'USER_WEATHER_REQUEST_LIMIT',
      5,
    );
  }

  async getWeather(
    city: string,
    date: string,
    userId: number,
  ): Promise<WeatherEntity> {
    const cacheKey = cacheKeys.weatherData(city, date);
    const userRequestCountKey = cacheKeys.userWeatherRequestCount(userId);

    const currentCount =
      (await this.cacheManager.get<number>(userRequestCountKey)) || 0;
    if (currentCount >= this.userRequestLimit) {
      await this.client.emit(emailService.pattern, {
        userId,
        userLimit: currentCount,
      });
      throw new HttpException(
        'User request limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    await this.cacheManager.set(userRequestCountKey, currentCount + 1);

    let weather = await this.cacheManager.get<WeatherEntity>(cacheKey);

    if (!weather) {
      const cityEntity = await this.cityRepository.findOne({
        where: { name: city },
      });

      if (!cityEntity) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }

      weather = await this.weatherRepository.findOne({
        where: {
          cityId: cityEntity.id,
          date,
        },
      });

      if (!weather) {
        throw new HttpException('Weather data not found', HttpStatus.NOT_FOUND);
      }

      await this.cacheManager.set(cacheKey, weather, 5000);
    }

    return weather;
  }
}
