import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { JwtToken } from './entities/jwt-token.entity'

@Injectable()
export class JwtTokenRepository extends Repository<JwtToken> {
    constructor(private dataSource: DataSource) {
        super(JwtToken, dataSource.createEntityManager())
    }

    async findJwtTokenByUserId(userId: number) {
        return this.findOne({ where: { user: { id: userId } } })
    }
}
