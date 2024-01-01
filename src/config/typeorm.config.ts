import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeORMConfig(
  configService: ConfigService,
): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    database: configService.get<string>('DB_NAME'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    entities: ['./src/**/*.entity.{js,ts}'],
    logging: true,
    autoLoadEntities: true,
    synchronize: false,
  };
}
