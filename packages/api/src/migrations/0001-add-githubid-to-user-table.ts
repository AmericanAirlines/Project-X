import { Migration } from '@mikro-orm/migrations';

export class Migration20211015025957 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "gitHubId" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "gitHubId";');
  }
}
