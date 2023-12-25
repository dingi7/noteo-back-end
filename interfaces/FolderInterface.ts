
import { Document } from 'mongoose';
export interface IFolder extends Document {
    _id: string;
    name: string;
    owner: string;
    notes: INote[];
}

export interface INote extends Document {
    _id: string;
    name: string;
    title: string;
    body: string;
    folder: IFolder;
}

