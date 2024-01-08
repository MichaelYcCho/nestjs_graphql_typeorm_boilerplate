import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { createUserInput, createUserOutput } from './dtos/create-user.dto'
import { UserService } from './users.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@auth/guards/jwt.access.guard'
import { AuthUser } from '@auth/decorators/auth-user.decorator'

@Resolver((of) => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation((returns) => createUserOutput)
    async createUser(@Args('input') userInput: createUserInput): Promise<createUserOutput> {
        return this.userService.createUser(userInput)
    }

    @Query((returns) => User)
    @UseGuards(JwtAuthGuard)
    myProfile(@AuthUser() authUser: User) {
        return authUser
    }
}
