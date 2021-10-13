import { Router } from 'express';
import { User } from '../entities/User';
import logger from '../logger';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';

export const users = Router();

// const publicFields: (keyof typeof User)[] = ['pronouns', 'wat'];
const stripSensitiveFields = (user: User): Partial<User> => ({
  name: user.name,
  pronouns: user.pronouns,
  schoolName: user.schoolName,
});

users.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if userId is in correct format
    if (Number.isNaN(Number(userId))) {
      res.status(400).send(`"${userId}" is not a valid id, it must be a number.`);
      return;
    }

    const user = await req.entityManager.findOne(User, { id: req.params.userId });

    // Check if user exists
    if (!user) {
      res.sendStatus(404);
      return;
    }

    // Return stripped user information
    res.status(200).send(stripSensitiveFields(user));
  }
  catch (error) {
    logger.error(`There was an issue getting user "${userId}"`, error);
    res.status(500).send(`There was an issue geting user "${userId}"`);
  }
});

 users.patch('/:userId', async (req, res) => {
  // const { userId } = req.params;
  
  // Also need list of User object columns to update - part of url?
  
  // Check if user exists
  // Set edited columns in DB to specified values
  // Use QueryBuilder to make a Patch query to DB
  // https://mikro-orm.io/docs/query-builder/

})
