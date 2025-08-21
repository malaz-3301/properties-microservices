import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1755805523874 implements MigrationInterface {
    name = 'Initial1755805523874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_micro" ("id" SERIAL NOT NULL, "usre_language_message" jsonb NOT NULL, "readAt" TIMESTAMP DEFAULT now(), "title" character varying NOT NULL, "userId" integer, "propertyId" integer, CONSTRAINT "PK_f142d45e16fe3d1c229be93d600" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reports_micro_title_enum" AS ENUM('Unauthorized deletion of property by admin', 'Disable notifications for a specific property', 'Request a refund of the subscription fee', 'Other')`);
        await queryRunner.query(`CREATE TYPE "public"."reports_micro_reportstatus_enum" AS ENUM('Pending', 'Fixed', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "reports_micro" ("id" SERIAL NOT NULL, "title" "public"."reports_micro_title_enum" NOT NULL, "reason" character varying(60), "mult_description" jsonb NOT NULL, "myEmail" character varying(32) NOT NULL, "reportStatus" "public"."reports_micro_reportstatus_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_c3b32a67f537ab3d86763728490" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_micro" ADD CONSTRAINT "FK_a8c27184068fbcc69d1fdc59f2f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_micro" ADD CONSTRAINT "FK_99919980ee62514e72d64421837" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_micro" DROP CONSTRAINT "FK_99919980ee62514e72d64421837"`);
        await queryRunner.query(`ALTER TABLE "notification_micro" DROP CONSTRAINT "FK_a8c27184068fbcc69d1fdc59f2f"`);
        await queryRunner.query(`DROP TABLE "reports_micro"`);
        await queryRunner.query(`DROP TYPE "public"."reports_micro_reportstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reports_micro_title_enum"`);
        await queryRunner.query(`DROP TABLE "notification_micro"`);
    }

}
