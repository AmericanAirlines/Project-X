import { Migration } from '@mikro-orm/migrations';

export class Migration20211031223328 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "email";');
  }
}
