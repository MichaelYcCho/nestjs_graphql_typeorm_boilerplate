import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CoreResponseOutput {
    @Field((type) => Boolean)
    isSuccess: boolean

    @Field((type) => String, { nullable: true })
    error?: string
}
