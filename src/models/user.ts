import mongoose, {Schema} from 'mongoose';
import {IUser} from "../interfaces/user";

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

export const UserModel = mongoose.model('User', userSchema);
