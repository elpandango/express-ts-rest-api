import mongoose, {Schema, Types, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  posts: mongoose.Types.ObjectId[];
  _id?: Types.ObjectId,
}

const userSchema = new Schema<IUser>({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});

export const UserModel = mongoose.model<IUser>('User', userSchema);