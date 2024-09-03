import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherEntity } from '../../database/entities/weather.entity';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CityEntity } from '../../database/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherEntity, CityEntity]), UsersModule],
  providers: [
    WeatherService,
    {
      provide: 'EMAIL_AMQP_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL_CLIENT')],
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
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [WeatherController],
})
export class WeatherModule {}
