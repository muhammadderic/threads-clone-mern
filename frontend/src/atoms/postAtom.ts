import { User } from '@/types/types';
import { atom } from 'jotai';

type Reply = {
  userId: string; // mongoose.Schema.Types.ObjectId
  text: string;
  userProfilePic?: string;
  username?: string;
  createdAt?: Date | string;
}

type Post = {
  _id: string;
  postedBy: User;
  text: string;
  img?: string;
  likes: string[]; // Array of user IDs
  replies: Reply[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const postsAtom = atom<Post[]>([]);
