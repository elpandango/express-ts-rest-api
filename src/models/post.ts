import mongoose, { Schema, Types } from 'mongoose';

interface IPost {
  title: string;
  imageUrl: string;
  content: string;
  createdAt: Date;
  creator: Types.ObjectId
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

export const Post = mongoose.model('Post', postSchema);
