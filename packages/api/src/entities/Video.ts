import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type VideoConstructorValues = ConstructorValues<Video>;

@Entity()
export class Video extends Node<Video> {
  @Property({ columnType: 'text' })
  name: string;

  constructor({ name, ...extraValues }: VideoConstructorValues) {
    super(extraValues);

    this.name = name;
  }
}

// new video entity
/*

Included fields:
- video_id 
- title 
- durationInSeconds
- url

*/