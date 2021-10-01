import { Migration } from '@mikro-orm/migrations';

export class Migration20210928102009 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "video" ("id" bigserial primary key, "title" text not null, "durationInSeconds" int not null, "url" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "video";');
  }
}
