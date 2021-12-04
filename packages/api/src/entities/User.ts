/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User, never, 'isAdmin'>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text' })
  githubId: string;

  @Property({ columnType: 'text' })
  githubUsername: string;

  @Property({ columnType: 'text', nullable: true })
  discordId?: string;

  @Property({ columnType: 'text', nullable: true })
  pronouns?: string;

  @Property({ columnType: 'text', nullable: true })
  location?: string;

  @Property({ columnType: 'boolean' })
  hireable: boolean;

  @Property({ columnType: 'text' })
  purpose: string;

  @Property({ columnType: 'text', nullable: true })
  schoolName?: string;

  @Property({ columnType: 'text', nullable: true })
  major?: string;

  @Property({ columnType: 'Date', nullable: true })
  graduationDate?: Date;

  @Property({ columnType: 'boolean' })
  isAdmin: boolean;

  @Property({ columnType: 'text' })
  email: string;

  @Property({ columnType: 'timestamp' })
  contributionsLastCheckedAt: Date;

  constructor({
    name,
    githubId,
    githubUsername,
    hireable,
    purpose,
    isAdmin,
    email,
    contributionsLastCheckedAt,
    ...extraValues
  }: UserConstructorValues) {
    super(extraValues);

    this.name = name;
    this.hireable = hireable;
    this.purpose = purpose;
    this.githubId = githubId;
    this.githubUsername = githubUsername;
    this.isAdmin = isAdmin ?? false;
    this.email = email;
    this.contributionsLastCheckedAt = contributionsLastCheckedAt;
  }
}
