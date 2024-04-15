import { Types } from 'mongoose';

export interface IPost {
  title: string;
  // imageUrl: string;
  content: string;
  creator: Types.ObjectId
}
