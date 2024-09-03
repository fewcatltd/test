import { IsDateString, IsString } from 'class-validator';

export class GetWeatherDto {
  @IsString()
  city: string;

  @IsDateString(
    {},
    { message: 'Invalid date format. Expected format: YYYY-MM-DD' },
  )
  date: string;
}
