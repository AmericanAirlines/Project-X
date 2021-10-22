/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type RepositoryConstructorValues = ConstructorValues<Repository>;

@Entity()
export class Repository extends Node<Repository> {
    @Property({ columnType: 'text' })
    nodeID: string;

    constructor({ nodeID, ...extraValues }: RepositoryConstructorValues)
    {
        super(extraValues);
        this.nodeID = nodeID;
    }
} 
