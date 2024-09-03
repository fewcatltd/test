import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MailerAppModule } from './mailer-app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MailerAppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL_MICROSERVICE')],
      queue: configService.get<string>('RABBITMQ_QUEUE_NAME_EMAIL'),
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange':
            configService.get<string>('RABBITMQ_DLX_NAME') ||
            'emails_dead_letter_exchange',
          'x-dead-letter-routing-key':
            configService.get<string>('RABBITMQ_DLQ_ROUTING_KEY') ||
            'emails_dead_letter',
        },
      },
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  console.log('Mailer microservice is listening...');
}

bootstrap();
