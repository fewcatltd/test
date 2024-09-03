import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder.service';
import { AppModule } from '../../app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const seeder = appContext.get(SeederService);

  try {
    await seeder.seed();
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
