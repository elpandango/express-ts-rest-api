import mongoose, {Schema, Types, Document} from 'mongoose';

export interface Post extends Document {
    title: string;
    imageUrl: string;
    content: string;
    creator: Types.ObjectId
}

const postSchema = new Schema<Post>({
    title: {type: String, required: true},
    imageUrl: {type: String, required: true},
    content: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true});

export const PostModel = mongoose.model<Post>('Post', postSchema);