import { atomWithStorage } from 'jotai/utils';

type User = {
  _id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  profilePic: string;
};

export const userAtom = atomWithStorage<User | null>(
  'user-threads',
  null,
  {
    getItem: (key) => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    setItem: (key, value) => {
      if (value) {
        const { _id, name, email, username, bio, profilePic } = value;
        const safeUserData = { _id, name, email, username, bio, profilePic };
        localStorage.setItem(key, JSON.stringify(safeUserData));
      } else {
        localStorage.removeItem(key);
      }
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
    },
  }
);