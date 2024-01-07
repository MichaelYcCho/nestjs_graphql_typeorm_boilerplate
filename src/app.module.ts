import * as Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeORMConfig } from '@config/typeorm.config'
import { graphqlConfig } from '@config/graphql.config'
import { AuthModule } from '@auth/auth.module'
import { UsersModule } from './users/users.module'
import { DataSource } from 'typeorm'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `./env/.env.${process.env.NODE_ENV}`,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('dev', 'prod').required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => typeORMConfig(configService),
            dataSourceFactory: async (options) => {
                return await new DataSource(options).initialize()
            },
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => graphqlConfig(configService),
            driver: ApolloDriver,
        }),
        AuthModule.forRoot(),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
