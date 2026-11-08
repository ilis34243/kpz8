import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLeisureEntities1792341345014 implements MigrationInterface {
  name = 'CreateLeisureEntities1792341345014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "hall_rentals" (
                "id" SERIAL NOT NULL,
                "start_datetime" TIMESTAMP NOT NULL,
                "end_datetime" TIMESTAMP NOT NULL,
                "total_cost" numeric(10, 2) NOT NULL,
                "status" character varying(20) NOT NULL DEFAULT 'RESERVED',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "hall_id" integer NOT NULL,
                "client_id" integer NOT NULL,
                CONSTRAINT "PK_b56681e648379044b3c9ddf3de8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "halls" (
                "id" SERIAL NOT NULL,
                "name" character varying(80) NOT NULL,
                "capacity" integer NOT NULL,
                "description" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_46711ac8c7003abe9f974263bfb" UNIQUE ("name"),
                CONSTRAINT "PK_4665c2f3b1e718e12b06278bae8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "events" (
                "id" SERIAL NOT NULL,
                "name" character varying(120) NOT NULL,
                "type" character varying(40) NOT NULL DEFAULT 'LESSON',
                "start_datetime" TIMESTAMP NOT NULL,
                "end_datetime" TIMESTAMP NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "hall_id" integer NOT NULL,
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "event_registrations" (
                "id" SERIAL NOT NULL,
                "seats" integer NOT NULL DEFAULT '1',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "event_id" integer NOT NULL,
                "client_id" integer NOT NULL,
                CONSTRAINT "UQ_event_registrations_event_client" UNIQUE ("event_id", "client_id"),
                CONSTRAINT "PK_953d3b862c2487289a92b2356e9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" SERIAL NOT NULL,
                "full_name" character varying(80) NOT NULL,
                "email" character varying(100) NOT NULL,
                "phone" character varying(20) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_b48860677afe62cd96e12659482" UNIQUE ("email"),
                CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "feedback" (
                "id" SERIAL NOT NULL,
                "rating" integer NOT NULL,
                "comment" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "client_id" integer NOT NULL,
                "event_id" integer NOT NULL,
                CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "hall_rentals"
            ADD CONSTRAINT "FK_0814cd794b9a4dd83bfe0925230" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "hall_rentals"
            ADD CONSTRAINT "FK_42385efbe6dfe23d4839786bbf8" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "events"
            ADD CONSTRAINT "FK_0d609124dfcd918e8b9dd08ec9a" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations"
            ADD CONSTRAINT "FK_28b0a253c87a80a4b013c437f7d" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations"
            ADD CONSTRAINT "FK_495a1d71115a21e8e4dc18fc2f4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "feedback"
            ADD CONSTRAINT "FK_e02982ecb5876db1639f835506f" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "feedback"
            ADD CONSTRAINT "FK_bd5532b1ca70202fb0cca230716" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "feedback" DROP CONSTRAINT "FK_bd5532b1ca70202fb0cca230716"
        `);
    await queryRunner.query(`
            ALTER TABLE "feedback" DROP CONSTRAINT "FK_e02982ecb5876db1639f835506f"
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_495a1d71115a21e8e4dc18fc2f4"
        `);
    await queryRunner.query(`
            ALTER TABLE "event_registrations" DROP CONSTRAINT "FK_28b0a253c87a80a4b013c437f7d"
        `);
    await queryRunner.query(`
            ALTER TABLE "events" DROP CONSTRAINT "FK_0d609124dfcd918e8b9dd08ec9a"
        `);
    await queryRunner.query(`
            ALTER TABLE "hall_rentals" DROP CONSTRAINT "FK_42385efbe6dfe23d4839786bbf8"
        `);
    await queryRunner.query(`
            ALTER TABLE "hall_rentals" DROP CONSTRAINT "FK_0814cd794b9a4dd83bfe0925230"
        `);
    await queryRunner.query(`
            DROP TABLE "feedback"
        `);
    await queryRunner.query(`
            DROP TABLE "clients"
        `);
    await queryRunner.query(`
            DROP TABLE "event_registrations"
        `);
    await queryRunner.query(`
            DROP TABLE "events"
        `);
    await queryRunner.query(`
            DROP TABLE "halls"
        `);
    await queryRunner.query(`
            DROP TABLE "hall_rentals"
        `);
  }
}
