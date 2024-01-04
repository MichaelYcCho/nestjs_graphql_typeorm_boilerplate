import { DB_SCHEMA, USER_PREFIX } from '@common/utils/constant'
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator'
import { TimeStamp } from '@common/entities/time-stamp.entity'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { JwtToken } from '@auth/entities/jwt-token.entity'

@InputType('UserInputType', { isAbstract: true })
@Index('email', ['email'], { unique: true })
@Entity({ schema: DB_SCHEMA, name: `${USER_PREFIX}_user` })
@ObjectType()
export class User extends TimeStamp {
    @IsNumber()
    @Field((type) => Number)
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number

    @IsEmail()
    @Field((type) => String)
    @Column('varchar', { name: 'email', length: 50, unique: true })
    email: string

    @IsString()
    @Field((type) => String)
    @Column('varchar', { name: 'password', length: 100, select: false })
    password: string

    @IsString()
    @Field((type) => String)
    @Column('varchar', { name: 'profile_name', length: 30 })
    profileName: string

    @IsBoolean()
    @Field((type) => Boolean)
    @Column('boolean', { name: 'is_active', default: true })
    isActive: boolean

    @Field((type) => JwtToken)
    @OneToOne(() => JwtToken, (jwtToken) => jwtToken.user)
    jwtToken: Relation<JwtToken>
}
