import { Migration } from '@mikro-orm/migrations';

export class Migration20211117105116 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "githubUsername" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "githubUsername";');
  }

}
