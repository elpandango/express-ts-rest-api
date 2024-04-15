import { Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name: string;
  // role: string;
  posts: any[];
  _id?: Types.ObjectId,
}
