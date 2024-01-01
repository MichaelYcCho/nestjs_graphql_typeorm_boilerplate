import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: `./env/.env.${process.env.NODE_ENV || 'dev'}` });

export function config(): DataSourceOptions {
  const configService = new ConfigService();

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    database: configService.get<string>('DB_NAME'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    entities: [User],
    migrations: ['./src/database/migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migration',
    logging: true,
    extra: {
      max: 100,
    },
  };
}

const dataSourceConfig = config();
export const dataSource = new DataSource(dataSourceConfig);
