import { Field } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimeStamp {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  @Field((type) => Date)
  updatedAt: Date;
}
