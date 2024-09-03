import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from '../setup-test';
import { UserEntity } from '../../../src/database/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { WeatherEntity } from '../../../src/database/entities/weather.entity';
import { GetWeatherDto } from '../../../src/modules/weather/dto/get-weather.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { cacheKeys, emailService } from '../../../src/common/constants';
import { CityEntity } from '../../../src/database/entities/city.entity';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;
  let userRepository;
  let weatherRepository;
  let cityRepository;
  let accessToken;
  let getWeatherDto: GetWeatherDto;
  let cacheManager;
  let emitter;

  const user = plainToInstance(UserEntity, {
    id: 1,
    email: 'testuser@example.com',
    password: bcrypt.hashSync('password', 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const weather = plainToInstance(WeatherEntity, {
    id: 1,
    city: 'London',
    date: '2024-01-01',
    temperature: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const city = plainToInstance(CityEntity, {
    id: 1,
    name: 'London',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeAll(async () => {
    app = await setupTestApp();
    userRepository = app.get('UserEntityRepository');
    userRepository.findOne.mockResolvedValue(user);
    weatherRepository = app.get('WeatherEntityRepository');
    weatherRepository.findOne.mockResolvedValue(weather);
    cityRepository = app.get('CityEntityRepository');
    cityRepository.findOne.mockResolvedValue(city);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'password' })
      .expect(201);
    accessToken = loginResponse.body.data.accessToken;
    getWeatherDto = { city: 'London', date: '2024-01-01' };
    cacheManager = app.get(CACHE_MANAGER);
    emitter = app.get('EMAIL_AMQP_SERVICE');
  });

  beforeEach(() => {
    cacheManager.get.mockResolvedValue(null);
    cacheManager.set.mockResolvedValue(null);
  });

  it('/weather (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/weather')
      .send(getWeatherDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  it('/weather (POST) - cache user request limits work', async () => {
    cacheManager.get.mockImplementation((key) => {
      if (key === cacheKeys.userWeatherRequestCount(user.id)) {
        return Promise.resolve(5);
      }
      return Promise.resolve(null);
    });

    const response = await request(app.getHttpServer())
      .post('/weather')
      .send(getWeatherDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(429);

    expect(emitter.emit).toHaveBeenCalledWith(emailService.pattern, {
      userId: user.id,
      userLimit: 5,
    });
    expect(response.body.message).toBe('User request limit exceeded');
  });

  it('/weather (POST) - cache works', async () => {
    cacheManager.get.mockImplementation((key) => {
      if (key === cacheKeys.userWeatherRequestCount(user.id)) {
        return Promise.resolve(1);
      }
      return Promise.resolve(null);
    });

    const response1 = await request(app.getHttpServer())
      .post('/weather')
      .send(getWeatherDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(response1.body.status).toBe('success');
    expect(response1.body.data).toBeDefined();

    cacheManager.get.mockImplementation((key) => {
      if (key === cacheKeys.userWeatherRequestCount(user.id)) {
        return Promise.resolve(1);
      }
      return Promise.resolve(response1.body.data);
    });

    expect(cacheManager.set).toHaveBeenCalledWith(
      cacheKeys.weatherData(getWeatherDto.city, getWeatherDto.date),
      weather,
      5000,
    );

    await request(app.getHttpServer())
      .post('/weather')
      .send(getWeatherDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    //once for weather, once for city
    expect(weatherRepository.findOne).toHaveBeenCalledTimes(2);
  });

  it('/weather (POST) - city not found', async () => {
    cityRepository.findOne.mockResolvedValue(null);
    const response = await request(app.getHttpServer())
      .post('/weather')
      .send({ city: 'UnknownCity', date: '2024-09-01' })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('City not found');
  });

  it('/weather (POST) - rate limiter works. Throttle exceeds', async () => {
    const requests = [];
    for (let i = 0; i < 6; i++) {
      requests.push(
        request(app.getHttpServer())
          .post('/weather')
          .send(getWeatherDto)
          .set('Authorization', `Bearer ${accessToken}`),
      );
    }

    const responses = await Promise.all(requests);
    expect(responses[5].res.statusCode).toBe(429);
  });

  afterAll(async () => {
    await app.close();
  });
});
