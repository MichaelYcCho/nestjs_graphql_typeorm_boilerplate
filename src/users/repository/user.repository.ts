import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(userId: number) {
    return this.findOne({ where: { id: userId } });
  }

  async findUserByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
