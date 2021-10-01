import { Router } from 'express';
import { User } from '../entities/User';

export const users = Router();



users.get('', async (_req, res) => {


    res.send({});
  });

users.get('/:userId', async (req, res) => {

  const userRepository = req.entityManager.getRepository(User);
  const selectedUser = await userRepository.findOne({ id : req.params.userId }); 

  res.send({
    selectedUser
  });
});

// add GET endpoint to return all user profile information from database
// Parameter: id 