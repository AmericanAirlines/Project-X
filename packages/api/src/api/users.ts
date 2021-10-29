import express, { Router } from 'express';
import { User, UserConstructorValues } from '../entities/User';
import logger from '../logger';

export const users = Router();
users.use(express.json());

const stripSensitiveFields = (user: User): Partial<User> => ({
  name: user.name,
  pronouns: user.pronouns,
  schoolName: user.schoolName,
  githubId: user.githubId,
  isAdmin: user.isAdmin,
});

users.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if userId is in correct format
    if (Number.isNaN(Number(userId))) {
      res.status(400).send(`"${userId}" is not a valid id, it must be a number.`);
      return;
    }

    const user = await req.entityManager.findOne(User, { id: userId });

    // Check if user exists
    if (!user) {
      res.sendStatus(404);
      return;
    }

    // Return stripped user information
    res.status(200).send(stripSensitiveFields(user));
  } catch (error) {
    logger.error(`There was an issue getting user "${userId}"`, error);
    res.status(500).send(`There was an issue getting user "${userId}"`);
  }
});

users.patch('/:userId', async (req, res) => {
  const { userId } = req.params;

  const currentUser = await req.entityManager.findOne(User, { githubId: req.user });
  const adminValue = currentUser?.isAdmin;

  try {
    if (Number.isNaN(Number(userId))) {
      res.status(400).send(`"${userId}" is not a valid id, it must be a number.`);
      return;
    }

    const user = await req.entityManager.findOne(User, { id: userId });

    if (!user) {
      res.sendStatus(404);
      return;
    }

    if (adminValue) {
      const editableFields: Array<keyof UserConstructorValues> = [
        'name',
        'pronouns',
        'schoolName',
        'isAdmin',
      ];

      // Create new patch object only containing fields that are in `editableFields`
      const sanitizedUser = Object.entries(req.body).reduce((acc, [key, value]) => {
        if (editableFields.includes(key as keyof UserConstructorValues)) {
          return {
            ...acc,
            [key]: value,
          };
        }
        return acc;
      }, {} as UserConstructorValues);

      user.assign(sanitizedUser);

      await req.entityManager.flush();
      res.send(user);
    } else {
      const editableFields: Array<keyof UserConstructorValues> = ['name', 'pronouns', 'schoolName'];

      // Create new patch object only containing fields that are in `editableFields`
      const sanitizedUser = Object.entries(req.body).reduce((acc, [key, value]) => {
        if (editableFields.includes(key as keyof UserConstructorValues)) {
          return {
            ...acc,
            [key]: value,
          };
        }
        return acc;
      }, {} as UserConstructorValues);

      user.assign(sanitizedUser);

      await req.entityManager.flush();
      res.send(user);
    }
  } catch (error) {
    logger.error(`There was an issue updating user "${userId}"`, error);
    res.status(500).send(`There was an issue updating user "${userId}"`);
  }
});
