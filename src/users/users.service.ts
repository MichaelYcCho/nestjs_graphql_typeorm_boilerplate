import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '@users/repository/user.repository'
import { createUserInput, createUserOutput } from '@users/dtos/create-user.dto'
import { ExceptionHandler } from '@core/errors/error.handler'
import { USERS_ERRORS } from '@core/errors/error.list'
import { bcryptHashing } from '@core/utils/hashing'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async createUser({ email, password, profileName }: createUserInput): Promise<createUserOutput> {
        try {
            const existUser = await this.userRepository.getUserByEmail(email)

            if (existUser) {
                throw new ExceptionHandler(USERS_ERRORS.USER_NAME_ALREADY_EXIST)
            }
            const hashedPassword = await bcryptHashing(password, 12)
            console.log('여기까진 이상없?', hashedPassword)
            await this.userRepository.save({
                email,
                password: hashedPassword,
                profileName,
            })
            return { isSuccess: true, error: null }
        } catch (e) {
            throw new ExceptionHandler(USERS_ERRORS.FAILED_CREATE_USER)
        }
    }
}
