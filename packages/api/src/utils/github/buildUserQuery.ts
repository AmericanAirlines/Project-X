import { User } from '../../entities/User';

export const buildUsersQuery = (users: User[]) => {
  const usersQuery = users.map((user) => `author:${user.githubUsername}`).join(' ');

  return usersQuery;
};
