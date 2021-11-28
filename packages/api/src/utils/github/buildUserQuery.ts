import { User } from '../../entities/User';

export const buildUsersQuery = (users: User[]) => {
  const queryString = users.map((user) => `author:${user.githubUsername}`).join(' ');

  return queryString;
};
