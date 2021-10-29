/* istanbul ignore file */
import { Entity, Property } from '@mikro-orm/core';
import { ConstructorValues } from '../utils/types';
import { Node } from './Node';

export type RepoListConstructorValues = ConstructorValues<RepoList>;

@Entity()
export class RepoList extends Node<RepoList> {
  // @Property({ columnType: 'text' })
  // id: string;

  @Property({ columnType: 'int' })
  stargazers_count: number;

  @Property({ columnType: 'text' })
  name: string;

  @Property({ columnType: 'text' })
  html_url: string;

  @Property({ columnType: 'text' })
  language: string;

  @Property({ columnType: 'text' })
  description: string;

  constructor({
    name,
    html_url,
    stargazers_count,
    language,
    description,
    ...extraValues
  }: RepoListConstructorValues) {
    super(extraValues);

    // this.id = id;
    this.name = name;
    this.html_url = html_url;
    this.stargazers_count = stargazers_count;
    this.language = language;
    this.description = description;
  }
}
