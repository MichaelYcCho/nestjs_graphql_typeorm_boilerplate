import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { createUserInput, createUserOutput } from './dtos/create-user.dto'
import { UserService } from './users.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@auth/guards/jwt.access.guard'
import { AuthUser } from '@auth/decorators/auth-user.decorator'
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto'

@Resolver((of) => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation((returns) => createUserOutput)
    async createUser(@Args('input') userInput: createUserInput): Promise<createUserOutput> {
        const { isSuccess, error } = await this.userService.createUser(userInput)
        return { isSuccess, error }
    }

    @UseGuards(JwtAuthGuard)
    @Query((returns) => UserProfileOutput)
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        const { isSuccess, error, user } = await this.userService.getUserProfile(userProfileInput.userId)
        return { isSuccess, error, user }
    }

    @Query((returns) => User)
    @UseGuards(JwtAuthGuard)
    myProfile(@AuthUser() authUser: User) {
        return authUser
    }
}
