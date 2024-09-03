import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get<number>('PORT', 3000));
  console.log(
    `HTTP server is listening on port ${configService.get<number>('PORT', 3000)}`,
  );
}

bootstrap();
