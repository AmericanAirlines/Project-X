import { Migration } from '@mikro-orm/migrations';

export class Migration20211027221948 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "discordId" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "discordId";');
  }
}
