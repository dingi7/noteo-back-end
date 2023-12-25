import { Schema, model, Document, Types } from 'mongoose';

interface IFolder extends Document {
    name: string;
    owner: Types.ObjectId;
    notes: Types.Array<Types.ObjectId>;
}

const folderSchema = new Schema<IFolder>({
    name: { type: String, required: true },
    owner: { type: Types.ObjectId as any, ref: 'User', required: true }, // Explicitly cast Types.ObjectId
    notes: [{ type: Types.ObjectId as any, ref: 'Note' }],
});

const Folder = model<IFolder>('Folder', folderSchema);
export default Folder;

