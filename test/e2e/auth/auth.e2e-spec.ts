import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { setupTestApp } from '../setup-test';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../../../src/database/entities/user.entity';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository;
  let loginDto: LoginDto;
  const password = 'password';

  const user = plainToInstance(UserEntity, {
    id: 1,
    email: 'testuser@example.com',
    password: bcrypt.hashSync(password, 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeAll(async () => {
    app = await setupTestApp();
    userRepository = app.get('UserEntityRepository');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/auth/login (POST) - success', async () => {
    loginDto = { email: user.email, password: 'password' };
    userRepository.findOne.mockResolvedValue(user);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('/auth/login (POST) - unauthorized (invalid user)', async () => {
    loginDto = { email: 'invalid', password: 'password' };
    userRepository.findOne.mockResolvedValue(null);
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(404);
  });

  it('/auth/login (POST) - unauthorized (invalid password)', async () => {
    const loginDto = { email: user.email, password: 'wrongPassword' };
    userRepository.findOne.mockResolvedValue(user);
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401);
  });

  it('should protect routes with AuthGuard', async () => {
    const protectedRouteResponse = await request(app.getHttpServer())
      .get('/auth/protected-route')
      .set('Authorization', 'Bearer invalidToken')
      .expect(401);

    expect(protectedRouteResponse.body.message).toBe('Unauthorized');
  });

  afterAll(async () => {
    await app.close();
  });
});
