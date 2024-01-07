import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@users/entities/user.entity'
import { UserResolver } from '@users/users.resolver'
import { UserService } from '@users/users.service'
import { UserRepository } from '@users/repository/user.repository'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserResolver, UserService, UserRepository],
    exports: [UserRepository],
})
export class UsersModule {}
