import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RpcResponse } from '../../types/rpc-response.interface';
import { GetWeatherResponse } from './interfaces/weather.interface';
import { Throttle } from '@nestjs/throttler';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @UseGuards(AuthGuard)
  @Post()
  async getWeather(
    @Body() getWeatherDto: GetWeatherDto,
    @Request() request,
  ): Promise<RpcResponse<GetWeatherResponse>> {
    const userId = request.user.id;
    const date = new Date(getWeatherDto.date).toISOString().split('T')[0];
    const weather = await this.weatherService.getWeather(
      getWeatherDto.city,
      date,
      userId,
    );
    return {
      status: 'success',
      data: {
        city: getWeatherDto.city,
        date: weather.date,
        temperature: weather.temperature,
      },
    };
  }
}
