import { Migration } from '@mikro-orm/migrations';

export class Migration20210928093735 extends Migration {

  async up(): Promise<void> {
    // edit to add correct columns
    this.addSql('create table "video" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null);');

    this.addSql('create table "user" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null);');
  }

  // add async down function
}
