import { Migration } from '@mikro-orm/migrations';

export class Migration20211125103211 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "contribution" add column "author" bigint not null;');

    this.addSql('alter table "contribution" add constraint "contribution_author_foreign" foreign key ("author") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contribution" drop constraint "contribution_author_foreign";');

    this.addSql('alter table "contribution" drop column "author";');
  }
}
