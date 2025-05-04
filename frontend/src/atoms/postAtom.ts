import { Post } from '@/types/types';
import { atom } from 'jotai';

export const postsAtom = atom<Post[]>([]);
