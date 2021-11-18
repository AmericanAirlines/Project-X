import { Migration } from '@mikro-orm/migrations';

export class Migration20211118121747 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "contribution" add column "authorGithubId" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contribution" drop column "authorGithubId";');
  }
}
