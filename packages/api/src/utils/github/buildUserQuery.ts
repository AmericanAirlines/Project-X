import { User } from '../../entities/User';

export const buildUsersQuery = (users: User[]) => {
  let queryString = '';

  users.forEach((u) => {
    queryString += `author:${u.githubUsername} `;
  });

  return queryString;
};
