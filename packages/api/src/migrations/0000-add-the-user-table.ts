import { Migration } from '@mikro-orm/migrations';

export class Migration20211003200607 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "pronouns" text null, "location" text not null, "hireable" boolean not null, "purpose" text null, "schoolName" text not null, "major" text not null, "graduationDate" Date not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "user";');
  }
}
