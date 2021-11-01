import { Migration } from '@mikro-orm/migrations';

export class Migration20211027072754 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "project" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "nodeID" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "project";');
  }
}
