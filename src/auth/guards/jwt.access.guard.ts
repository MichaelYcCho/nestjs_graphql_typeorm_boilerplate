import { AuthService } from '@auth/services/auth.service'
import { ExceptionHandler } from '@core/errors/error.handler'
import { AUTH_ERRORS } from '@core/errors/error.list'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private readonly configService: ConfigService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<any> {
        try {
            const gqlContext = GqlExecutionContext.create(context).getContext()
            const request = gqlContext['req']
            const authHeader = request.headers['authorization']
            if (!authHeader) {
                return false
            }

            // Format: 'Bearer [token]'
            const token = authHeader.split(' ')[1]
            const tokenUser = await this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            })
            const userId = tokenUser?.id

            if (!userId) {
                return false
            }

            const user = await this.authService.getUserInfo(userId)
            if (user == null) {
                throw new ExceptionHandler(AUTH_ERRORS.FAILED_AUTHENTICATE)
            }
            gqlContext['user'] = user
            return true
        } catch (err) {
            console.error('[JwtAccessAuthGuard] Error: ', err)
            if (err.name === 'TokenExpiredError') {
                throw new ExceptionHandler(AUTH_ERRORS.EXPIRED_TOKEN)
            } else if (err.name === 'JsonWebTokenError') {
                throw new ExceptionHandler(AUTH_ERRORS.INVALID_SIGNATURE)
            }
            throw new ExceptionHandler(AUTH_ERRORS.FAILED_AUTHENTICATE)
        }
    }
}
