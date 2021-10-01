/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<User>;

@Entity()
export class User extends Node<User> {
  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text' })
  pronouns: string;

  @Property({ columnType: 'text' })
  location?: string;

  @Property( { columnType: 'boolean'})
  hireable?: boolean;

  @Property({ columnType: 'text' })
  purpose: string;

  @Property({ columnType: 'text' })
  schoolName:string;

  @Property({ columnType: 'text' })
  major: string;

  @Property({ columnType: 'Date' })
  graduationDate?: Date;


  constructor({ name, pronouns, location, hireable, purpose, schoolName, major, graduationDate, ...extraValues }: UserConstructorValues) {
    super(extraValues);

    this.name = name;
   
    this.pronouns = pronouns;
    this.purpose = purpose;
    this.schoolName = schoolName;
    this.major = major;
    this.graduationDate = graduationDate;
    // add other fields to constructor
  }
}