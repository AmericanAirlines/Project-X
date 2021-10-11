/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type VideoConstructorValues = ConstructorValues<Video>;

@Entity()
export class Video extends Node<Video> {
  @Property({ columnType: 'text' })
<<<<<<< HEAD
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
=======
  title: string;

  @Property({ columnType: 'int' })
  durationInSeconds: number;

  @Property({ columnType: 'text' })
  url: string;

  constructor({ title, durationInSeconds, url, ...extraValues }: VideoConstructorValues) {
    super(extraValues);

    this.title = title;
    this.durationInSeconds = durationInSeconds;
    this.url = url;
  }
}
>>>>>>> upstream/main
