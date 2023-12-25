import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    hashedPassword: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
});

const User = model<IUser>('User', userSchema);
export default User;
