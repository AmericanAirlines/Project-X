import { Migration } from '@mikro-orm/migrations';

export class Migration20210928102009 extends Migration {

  async up(): Promise<void> {
    // add correct fields
    this.addSql('create table "video" ("video_id" bigserial primary key, "title" text not null, "durationInSeconds" int not null, "url" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "video";');
  }
}
