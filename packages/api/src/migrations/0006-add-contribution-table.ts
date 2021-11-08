import { Migration } from '@mikro-orm/migrations';

export class Migration20211108231628 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "contribution" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "nodeID" text not null, "description" text not null, "type" text not null, "score" int not null, "contributedAt" timestamp not null);');
  }
  async down(): Promise<void> {
    this.addSql('drop table "contribution";');
  }
}
