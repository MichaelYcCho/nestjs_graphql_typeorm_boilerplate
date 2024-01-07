import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtTokenRepository } from '@auth/auth.repository'
import { TokenPayload } from '@auth/auth_type'
import { AccessTokenResponseDto, RefreshTokenRequestDto } from '@auth/dto/auth-jwt.dto'
import { ExceptionHandler } from '@core/errors/error.handler'
import { AUTH_ERRORS, USERS_ERRORS } from '@core/errors/error.list'
import { bcryptHashing } from '@core/utils/hashing'
import { User } from '@users/entities/user.entity'
import { UserRepository } from '@users/repository/user.repository'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(JwtTokenRepository)
        private jwtTokenRepository: JwtTokenRepository,
        private readonly configService: ConfigService,
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) {}

    async validateUser(userName: string, password: string): Promise<any> {
        const user = await this.userRepository.getUserByEmailWithPwd(userName)
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user // eslint-disable-line
            return result
        } else {
            throw new ExceptionHandler(AUTH_ERRORS.FAILED_AUTHENTICATE)
        }
    }

    async getJwtToken(user: User) {
        /*
            Comments: 
                Create access token & refresh token.
        */
        const accessToken = await this.createAccessToken(user)
        const refreshToken = await this.createRefreshToken(user)
        return { accessToken, refreshToken }
    }

    async createAccessToken(user: User): Promise<string> {
        /*
            Comments: 
                Create access token.
        */
        const payload: TokenPayload = {
            id: user.id,
            profileName: user.profileName,
        }
        const accessToken = this.jwtService.sign(payload)
        return accessToken
    }

    async createRefreshToken(user: User): Promise<string> {
        /*
            Comments: 
                Create refresh token.
        */
        const payload: TokenPayload = {
            id: user.id,
            profileName: user.profileName,
        }
        const refreshToken = this.jwtService.sign(
            { id: payload.id },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
            },
        )
        return refreshToken
    }

    async createOrUpdateRefreshToken(user: User, refreshToken: any): Promise<void> {
        /*
            Comments: 
                If the user has a refresh token, update it.
                If the user does not have a refresh token, create it.
        */
        const jwtToken = await this.jwtTokenRepository.findJwtTokenByUserId(user.id)
        const verifiedToken = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        })
        const refreshExpiredAt = verifiedToken.exp
        const hashingToken = await bcryptHashing(refreshToken, 10)

        try {
            if (jwtToken == null) {
                await this.jwtTokenRepository.save({
                    user,
                    refreshToken: hashingToken,
                    refreshTokenExpiredAt: refreshExpiredAt,
                })
            } else {
                await this.jwtTokenRepository.update(jwtToken.id, {
                    refreshToken: hashingToken,
                    refreshTokenExpiredAt: refreshExpiredAt,
                })
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    async reissueAccessToken(refreshTokenDto: RefreshTokenRequestDto): Promise<AccessTokenResponseDto> {
        /*
            Comments: 
                Reissue access token from refresh token.
        */
        const { refreshToken } = refreshTokenDto
        const decodedRefreshToken = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        }) as TokenPayload

        const userId = decodedRefreshToken.id
        const user = await this.getUserIfRefreshTokenMatches(refreshToken, userId)
        if (!user) {
            throw new ExceptionHandler(USERS_ERRORS.NOT_EXIST_USER)
        }

        const accessToken = await this.createAccessToken(user)
        return { accessToken }
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
        /*
            Comments: 
                Check if the refresh token is valid.
                if refresh token is None, return null.
        */

        const user: User = await this.userRepository.getUserByIdWithJwtInfo(userId)

        if (!user.jwtToken.refreshToken) {
            return null
        }

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.jwtToken.refreshToken)
        if (isRefreshTokenMatching) {
            return user
        }
    }

    async removeRefreshToken(user: User): Promise<any> {
        /*
            Comments: 
                Remove refresh token.
        */
        const jwtToken = await this.jwtTokenRepository.findJwtTokenByUserId(user.id)

        if (!jwtToken) {
            throw new ExceptionHandler(AUTH_ERRORS.NOT_EXIST_TOKEN)
        }

        return await this.jwtTokenRepository.update(user.id, {
            refreshToken: null,
            refreshTokenExpiredAt: null,
        })
    }

    async getUserInfo(userId: number): Promise<User> {
        return await this.userRepository.getUserById(userId)
    }
}
