import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatJwtToken1704538688821 implements MigrationInterface {
    name = 'CreatJwtToken1704538688821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "jwt_token" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "id" SERIAL NOT NULL, 
                "refresh_token" character varying(255), 
                "refresh_token_expired_at" integer, "user_id" integer, CONSTRAINT "REL_495abb0d13ec5431f739ea48c2" UNIQUE ("user_id"), CONSTRAINT "PK_aab34637fd60fa0fbf001855e4f" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "jwt_token" ADD CONSTRAINT "FK_495abb0d13ec5431f739ea48c2c" FOREIGN KEY ("user_id") REFERENCES "users_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jwt_token" DROP CONSTRAINT "FK_495abb0d13ec5431f739ea48c2c"`)
        await queryRunner.query(`DROP TABLE "jwt_token"`)
    }
}
