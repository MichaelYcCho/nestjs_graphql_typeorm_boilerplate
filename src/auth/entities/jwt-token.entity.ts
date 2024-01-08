import { TimeStamp } from '@core/entities/time-stamp.entity'
import { JWT_PREFIX } from '@core/utils/constant'
import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '@users/entities/user.entity'
import { IsNumber, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity({ schema: 'public', name: `${JWT_PREFIX}_token` })
export class JwtToken extends TimeStamp {
    @IsNumber()
    @Field((type) => Number)
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number

    @IsString()
    @Field((type) => String)
    @Column('varchar', { name: 'refresh_token', length: 255, nullable: true })
    refreshToken: string

    @IsNumber()
    @Field((type) => Number)
    @Column('int', { name: 'refresh_token_expired_at', nullable: true })
    refreshTokenExpiredAt: number

    @Field((type) => User)
    @OneToOne(() => User, (user) => user.jwtToken, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User
}
