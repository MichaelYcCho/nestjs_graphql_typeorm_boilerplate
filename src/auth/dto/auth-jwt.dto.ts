import { Field } from '@nestjs/graphql'
import { UserDto } from '@users/dtos/user-info.dto'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class AuthRequestUserDto {
    @IsNotEmpty()
    @IsString()
    @Field((type) => String)
    email: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
        message: 'password accepts alphanumeric or characters',
    })
    @Field((type) => String)
    password: string
}

export class TokenInfoResponseDto {
    @IsString()
    @Field((type) => String)
    accessToken: string

    @IsString()
    @Field((type) => String)
    refreshToken: string

    @Field((type) => UserDto)
    user: UserDto
}

export class AccessTokenDto {
    @IsNotEmpty()
    @IsString()
    @Field((type) => String)
    accessToken: string
}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    @Field((type) => String)
    refreshToken: string
}
