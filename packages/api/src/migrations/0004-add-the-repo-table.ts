import { Migration } from '@mikro-orm/migrations';

export class Migration20211029184919 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "repo-list" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "stargazers_count" int not null, "name" text not null, "html_url" text not null, "language" text not null, "description" text not null);');
  }
}
