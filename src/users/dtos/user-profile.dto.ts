import { CoreResponseOutput } from '@core/dtos/core-response.dto'
import { ArgsType, Field, ObjectType } from '@nestjs/graphql'
import { User } from '@users/entities/user.entity'

@ArgsType()
export class UserProfileInput {
    @Field((type) => Number)
    userId: number
}

@ObjectType()
export class UserProfileOutput extends CoreResponseOutput {
    @Field((type) => User, { nullable: true })
    user?: User
}
