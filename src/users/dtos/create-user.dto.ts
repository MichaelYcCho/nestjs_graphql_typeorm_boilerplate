import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { User } from '../entities/user.entity'

@InputType()
export class createUserInput extends PickType(User, ['email', 'password', 'profileName']) {}

@ObjectType()
export class createUserOutput {
    @Field((type) => String, { nullable: true })
    error?: string

    @Field((type) => Boolean)
    isSuccess: boolean
}
