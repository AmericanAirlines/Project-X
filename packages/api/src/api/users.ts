import { Router } from 'express';
import { User, UserConstructorValues } from '../entities/User';
import logger from '../logger';

export const users = Router();

const stripSensitiveFields = (user: User): Partial<User> => ({
  id: user.id,
  name: user.name,
  pronouns: user.pronouns,
  schoolName: user.schoolName,
  githubId: user.githubId,
  isAdmin: user.isAdmin,
  discordId: user.discordId,
});

users.get('/me', async (req, res) => {
  if (req.user) {
    try {
      const user = await req.entityManager.findOne(User, { githubId: req.user.profile.id });

      if (user) res.send(user);
      else res.sendStatus(404);
    } catch (error) {
      const errorMessage = 'There was an issue getting the currently logged in user';
      logger.error(errorMessage, error);
      res.status(500).send(errorMessage);
    }
  } else res.status(401).send('You must be logged in.');
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
    const errorMessage = `There was an issue getting user "${userId}"`;
    logger.error(errorMessage, error);
    res.status(500).send(errorMessage);
  }
});

users.patch('/:userId', async (req, res) => {
  if (req.user) {
    const { userId } = req.params;

    const currentUser = await req.entityManager.findOne(User, { githubId: req.user.profile.id });
    const adminValue = currentUser?.isAdmin ?? false;

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

      if (currentUser !== user) {
        res.sendStatus(403);
        return;
      }

      const editableFields: Array<keyof UserConstructorValues> = adminValue
        ? ['name', 'pronouns', 'schoolName', 'discordId', 'isAdmin']
        : ['name', 'pronouns', 'schoolName', 'discordId'];

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
    } catch (error) {
      const errorMessage = `There was an issue updating user "${userId}"`;
      logger.error(errorMessage, error);
      res.status(500).send(errorMessage);
    }
  } else {
    res.sendStatus(401);
  }
});
