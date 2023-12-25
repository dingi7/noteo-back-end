import { Schema, model, Document, Types } from 'mongoose';

interface INote extends Document {
    name: string;
    title: string;
    body: string;
    folder: Types.ObjectId;
}

const noteSchema = new Schema<INote>({
    name: { type: String, required: true },
    title: { type: String, required: false },
    body: { type: String, required: false },
    folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
});

const Note = model<INote>('Note', noteSchema);
export default Note;
