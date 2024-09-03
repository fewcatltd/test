import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserEntity } from '../../../src/database/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { setupTestApp } from '../setup-test';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository;
  let cacheManager;

  beforeAll(async () => {
    app = await setupTestApp();
    userRepository = app.get('UserEntityRepository');
    cacheManager = app.get(CACHE_MANAGER);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/users/limits (GET) - success', async () => {
    const password = 'password';
    const user = plainToInstance(UserEntity, {
      id: 1,
      email: 'testuser@example.com',
      password: bcrypt.hashSync(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userRepository.findOne.mockResolvedValue(user);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password })
      .expect(201);
    const { accessToken } = loginResponse.body.data;
    cacheManager.get.mockResolvedValue(100);
    const response = await request(app.getHttpServer())
      .get('/users/limits')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data).toBe(100);
  });

  it('/users (POST) - create user', async () => {
    const createUserDto = { username: 'newuser', password: 'password' };
    const user = plainToInstance(UserEntity, {
      id: 1,
      email: 'testuser@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    userRepository.save.mockResolvedValue(user);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(response.body.status).toBe('success');
    expect(response.body.data.email).toBe(user.email);
  });

  afterAll(async () => {
    await app.close();
  });
});
