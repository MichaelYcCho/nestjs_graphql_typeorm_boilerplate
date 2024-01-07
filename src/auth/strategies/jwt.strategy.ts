import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'

import { UserRepository } from '@users/repository/user.repository'
import { ExceptionHandler } from '@core/errors/error.handler'
import { AUTH_ERRORS } from '@core/errors/error.list'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload) {
        const { userId } = payload
        const user = await this.userRepository.getUserById(userId)
        if (!user) {
            throw new ExceptionHandler(AUTH_ERRORS.INVALID_TOKEN)
        }
        return user
    }
}
