/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type VideoConstructorValues = ConstructorValues<Video>;

@Entity()
export class Video extends Node<Video> {
    // add all fields for the video entity
  @Property({ columnType: 'text' })
  name: string;

  constructor({ name, ...extraValues }: VideoConstructorValues) {
    super(extraValues);

    this.name = name;
  }
}
