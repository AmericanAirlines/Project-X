/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type UserConstructorValues = ConstructorValues<Repository>;

@Entity()
export class Repository extends Node<Repository> {
    // If using GraphQL: The Node ID of Repository (String)
    // If using REST API: Owner's Name (String), Repository Name (String)
}