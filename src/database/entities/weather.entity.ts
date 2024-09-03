import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'weathers', name: 'weathers' })
export class WeatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'city_id' })
  cityId: number;

  @Column({ type: 'date' })
  date: string;

  @Column()
  temperature: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
    default: 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
    default: 'now()',
  })
  updatedAt: Date;
}
