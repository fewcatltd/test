import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { UserEntity } from '../../src/database/entities/user.entity';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { WeatherEntity } from '../../src/database/entities/weather.entity';
import { CityEntity } from '../../src/database/entities/city.entity';

export async function setupTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, CacheModule.register()],
  })
    .overrideProvider(DataSource)
    .useValue({
      createEntityManager: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getRepository: jest.fn().mockImplementation((entity) => ({
        findOne: jest.fn(),
        save: jest.fn(),
      })),
      transaction: jest.fn(),
    })
    .overrideProvider(getRepositoryToken(UserEntity))
    .useValue({
      findOne: jest.fn(),
      save: jest.fn(),
    })
    .overrideProvider(getRepositoryToken(WeatherEntity))
    .useValue({
      findOne: jest.fn(),
      save: jest.fn(),
    })
    .overrideProvider(getRepositoryToken(CityEntity))
    .useValue({
      findOne: jest.fn(),
      save: jest.fn(),
    })
    .overrideProvider(CACHE_MANAGER)
    .useValue({
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    })
    .overrideProvider('EMAIL_AMQP_SERVICE')
    .useValue({
      emit: jest.fn(),
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
