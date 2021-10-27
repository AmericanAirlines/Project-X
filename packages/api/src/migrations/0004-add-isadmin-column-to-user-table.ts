import { Migration } from '@mikro-orm/migrations';

export class Migration20211027211404 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "isAdmin" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "isAdmin";');
  }
}
