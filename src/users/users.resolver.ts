import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { createUserInput, createUserOutput } from './dtos/create-user.dto';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => createUserOutput)
  async createUser(
    @Args('input') createUserInput: createUserInput,
  ): Promise<createUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Query((returns) => Boolean)
  isUserTest(): Boolean {
    return true;
  }
}
