import mongoose, {Schema} from 'mongoose';
import {IUser} from "../interfaces/user";
// enum Roles {User, Admin}

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
  // role: {
  //   type: String,
  //   default: Roles.User.toString()
  // },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

export const User = mongoose.model('User', userSchema);
