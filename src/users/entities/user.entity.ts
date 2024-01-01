import { DB_SCHEMA, USER_PREFIX } from '@common/utils/constant';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { TimeStamp } from '@common/entities/time-stamp.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity({ schema: DB_SCHEMA, name: `${USER_PREFIX}_user` })
@ObjectType()
export class User extends TimeStamp {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @Column('varchar', { name: 'email', length: 50, unique: true })
  email: string;

  @IsString()
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @IsString()
  @Column('varchar', { name: 'profile_name', length: 30 })
  profileName: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;
}
