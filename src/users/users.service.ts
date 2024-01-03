import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '@users/repository/user.repository'
import { createUserInput, createUserOutput } from '@users/dtos/create-user.dto'
import { ExceptionHandler } from '@common/errors/error.handler'
import { USERS_ERRORS } from '@common/errors/error.list'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async createUser({ email, password, profileName }: createUserInput): Promise<createUserOutput> {
        try {
            const existUser = await this.userRepository.findUserByEmail(email)

            if (existUser) {
                throw new ExceptionHandler(USERS_ERRORS.USER_NAME_ALREADY_EXIST)
            }
            await this.userRepository.save({
                email,
                password,
                profileName,
            })
            return { isSuccess: true, error: null }
        } catch (e) {
            throw new ExceptionHandler(USERS_ERRORS.FAILED_CREATE_USER)
        }
    }
}
