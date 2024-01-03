import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { GraphQLError } from 'graphql'

export function graphqlConfig(
    configService: ConfigService,
): Omit<ApolloDriverConfig, 'driver'> | (Promise<Omit<ApolloDriverConfig, 'driver'>> & { uploads: boolean }) {
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
            return {
                name: error.name,
                message: error.message,
                errorCode: error.extensions?.errorCode || 999999,
                path: error.path,
                locations: error.locations,
            }
        },
    }
}
