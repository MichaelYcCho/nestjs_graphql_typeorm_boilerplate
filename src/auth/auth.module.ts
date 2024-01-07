import { DynamicModule, Global, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '@users/users.module'
import { AuthService } from './services/auth.service'
import { AuthResolver } from './auth.resolver'
import { JwtTokenRepository } from './auth.repository'
import { UserRepository } from '@users/repository/user.repository'
import { JwtStrategy } from './strategies/jwt.strategy'

@Global()
@Module({})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                ConfigModule,
                UsersModule,
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get<string>('JWT_ACCESS_SECRET'),
                        signOptions: {
                            expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
                        },
                    }),
                    inject: [ConfigService],
                }),
            ],
            providers: [AuthResolver, AuthService, JwtTokenRepository, UserRepository, JwtStrategy],
            controllers: [],
            exports: [AuthService, JwtModule],
        }
    }
}
