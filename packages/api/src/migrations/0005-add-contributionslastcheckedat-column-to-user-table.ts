import { Migration } from '@mikro-orm/migrations';

export class Migration20211108225408 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "contributionsLastCheckedAt" timestamp null;');
  }
  async down(): Promise<void>
  {
    this.addSql('alter table "user" drop column "contributionsLastCheckedAt";');
  }
 }
