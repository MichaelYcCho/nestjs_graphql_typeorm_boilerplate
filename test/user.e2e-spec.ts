import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { AppModule } from 'src/app.module'
import { DataSource, Repository } from 'typeorm'
import request from 'supertest'

const GRAPHQL_ENDPOINT = '/graphql'

const testUser = {
    email: 'michael@las.com',
    password: '12345',
    profileName: 'michael',
}

describe('UserModule (e2e)', () => {
    let app: INestApplication
    let userRepository: Repository<User>
    let jwtToken: string

    const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT)
    const publicTest = (query: string) => baseTest().send({ query })
    const privateTest = (query: string) => baseTest().set('X-JWT', jwtToken).send({ query })

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
        app = module.createNestApplication()
        // getRepositoryToken(User)는 User entity의 repository를 가져온다.
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        await app.init()
    })

    afterAll(async () => {
        const dataSource: DataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })
        const connection: DataSource = await dataSource.initialize()
        await connection.dropDatabase() // 데이터베이스 삭제
        await connection.destroy() // 연결 해제
        await app.close()
    })

    // 유저 생성 e2e 테스트
    describe('createUser', () => {
        it('should create user', () => {
            return publicTest(`
                        mutation {
                            createUser(input: {
                                email:"${testUser.email}",
                                password:"${testUser.password}",
                                profileName:"${testUser.profileName}"
                            }) {
                                error
                                isSuccess
                                }
                            }`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.createUser.isSuccess).toBe(true)
                    expect(res.body.data.createUser.error).toBe(null)
                })
        })
    })
})
