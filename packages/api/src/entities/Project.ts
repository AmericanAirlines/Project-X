/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type ProjectConstructorValues = ConstructorValues<Project>;

@Entity()
export class Project extends Node<Project> {
  @Property({ columnType: 'text' })
  nodeID: string;

  constructor({ nodeID, ...extraValues }: ProjectConstructorValues) {
    super(extraValues);
    this.nodeID = nodeID;
  }
}
