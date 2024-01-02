import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { config } from 'process';

export function graphqlConfig(
  configService: ConfigService,
):
  | Omit<ApolloDriverConfig, 'driver'>
  | (Promise<Omit<ApolloDriverConfig, 'driver'>> & { uploads: boolean }) {
  return {
    uploads: false,
    autoSchemaFile: true,
    sortSchema: true,
    playground: false,
    ...(configService.get<string>('NODE_ENV') !== 'prod' && {
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    context: ({ req }) => ({ req }),
    cache: 'bounded',
  };
}
