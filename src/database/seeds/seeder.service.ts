import { Injectable, Logger } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { WeatherSeeder } from './weather.seeder';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly weatherSeeder: WeatherSeeder,
  ) {}

  async seed() {
    this.logger.log('Starting the seeding process...');

    try {
      await this.userSeeder.run();
      await this.weatherSeeder.run();
      this.logger.log('Seeding completed successfully.');
    } catch (error) {
      this.logger.error('Seeding failed:', error);
    }
  }
}
