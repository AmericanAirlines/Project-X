import { Router } from 'express';
import { User } from '../entities/User';

export const users = Router();

users.get('', (_req, res) => {
    res.send({
      ok: true,
    });
  });

users.get('/:userId', (req, res) => {

  const userRepository = req.entityManager.getRepository(User);
  const selectedUser = userRepository.findOne({ id : req.params.userId });

  res.send({
    selectedUser
  });
});

// add GET endpoint to return all user profile information from database
// Parameter: id 