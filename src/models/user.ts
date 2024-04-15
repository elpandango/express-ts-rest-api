import mongoose, { Schema, Types } from 'mongoose';

// enum Roles {User, Admin}

interface IUser {
  email: string;
  password: string;
  name: string;
  // role: string;
  posts: any[]
}

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
