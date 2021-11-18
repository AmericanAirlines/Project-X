import { Migration } from '@mikro-orm/migrations';

export class Migration20211118060304 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "contribution" add constraint "contribution_nodeID_unique" unique ("nodeID");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contribution" drop constraint "contribution_nodeID_unique";');
  }
}
