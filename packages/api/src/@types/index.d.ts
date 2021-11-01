import type { EntityManager } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';

declare global {
  namespace Express {
    export interface Request {
      entityManager: EntityManager<PostgreSqlDriver>;
    }
    export interface User {
      profile: {
        id: string;
      };
      githubToken: string;
    }
  }
}
