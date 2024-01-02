import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@users/repository/user.repository';
import { createUserInput, createUserOutput } from '@users/dtos/create-user.dto';
import { GraphQLError } from 'graphql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser({
    email,
    password,
    //profileName,
  }: createUserInput): Promise<createUserOutput> {
    try {
      const existUser = await this.userRepository.findUserByEmail(email);

      if (existUser) {
        throw new GraphQLError('이미 존재하는 이메일입니다.');
      }
      const user = await this.userRepository.save({
        email,
        password,
        //  profileName,
      });

      throw new GraphQLError('ㅋㅋㅋ 존재하는 이메일입니다.');
    } catch (e) {
      console.log('흠?');
      throw new GraphQLError('ㅊㅊ 존재하는 이메일입니다.');
      //      return { ok: false, error: "Couldn't create account" };
    }
  }
}
