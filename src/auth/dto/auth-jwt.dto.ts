import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { UserResponseDto } from '@users/dtos/user-info.dto'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

@InputType()
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

@ObjectType()
export class TokenInfoResponseDto {
    @IsString()
    @Field((type) => String)
    accessToken: string

    @IsString()
    @Field((type) => String)
    refreshToken: string

    @Field((type) => UserResponseDto)
    user: UserResponseDto
}

export class AccessTokenResponseDto {
    @IsNotEmpty()
    @IsString()
    @Field((type) => String)
    accessToken: string
}

@InputType()
export class RefreshTokenRequestDto {
    @IsNotEmpty()
    @IsString()
    @Field((type) => String)
    refreshToken: string
}
