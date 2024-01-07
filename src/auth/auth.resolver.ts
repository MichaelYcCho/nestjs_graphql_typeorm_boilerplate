import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from './services/auth.service'
import { AuthRequestUserDto, TokenInfoResponseDto } from './dto/auth-jwt.dto'
import { JwtToken } from './entities/jwt-token.entity'

@Resolver((of) => JwtToken)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation((returns) => TokenInfoResponseDto)
    async login(@Args('input') input: AuthRequestUserDto): Promise<TokenInfoResponseDto> {
        const user = await this.authService.validateUser(input.email, input.password)
        const { accessToken, refreshToken } = await this.authService.getJwtToken(user)
        await this.authService.createOrUpdateRefreshToken(user, refreshToken)

        return {
            accessToken,
            refreshToken,
            user: user,
        }
    }
}
