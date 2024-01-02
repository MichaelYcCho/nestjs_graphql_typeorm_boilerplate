import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { config } from 'process';
import { GraphQLError } from 'graphql';

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
    formatError: (error: GraphQLError) => {
      console.log('흠', error);
      return {
        name: error.name,
        message: error.message,
        // extensions: error.extensions,
        locations: error.locations,
        path: error.path,
      };
    },
  };
}
