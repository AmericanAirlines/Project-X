/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type ContributionConstructorValues = ConstructorValues<Contribution>;

@Entity()
export class Contribution extends Node<Contribution> {
  @Property({ columnType: 'text' })
  nodeID: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'text' })
  type: string;

  @Property({ columnType: 'int' })
  score: number;

  @Property({ columnType: 'timestamp' })
  contributedAt: Date;

  constructor({
    nodeID,
    description,
    type,
    score,
    contributedAt,
    ...extraValues
  }: ContributionConstructorValues) {
    super(extraValues);
    this.nodeID = nodeID;
    this.description = description;
    this.type = type;
    this.score = score;
    this.contributedAt = contributedAt;
  }
}
