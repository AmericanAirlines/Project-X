import { Migration } from '@mikro-orm/migrations';

export class Migration20211022004553 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "repository" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "nodeID" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "repository";')
  }

}