import Note from '../../models/noteModel';
import { getFolderById } from './folderService';
import { getUserById } from './auth';
import { INote } from '../../interfaces/FolderInterface';

async function getNoteById(noteId: string, ownerId: string) {
    try {
        const note = await getNoteIfAuthorized(noteId, ownerId);
        if (!note) {
            throw new Error('No note found for the given id');
        }
        return note;
    } catch (err: any) {
        throw new Error('Invalid note id');
    }
}

async function createNote(name: string, folderId: string, _id: string) {
    const folder = await getFolderById(folderId, _id);
    if (!folder) {
        throw new Error('Folder not found');
    }
    const note = new Note({
        name: name,
        folder: folderId,
    });
    await note.save();
    folder.notes.push(note._id);
    await folder.save();
    return note;
}

async function getNoteIfAuthorized(noteId: string, ownerId: string) {
    const note: INote | null = await Note.findById(noteId).populate('folder');
    if (!note) {
        throw new Error('Note not found');
    }
    const owner = await getUserById(ownerId);
    if (!note.folder.owner == owner!._id) {
        throw new Error('Unauthorized access to folder');
    }
    return note;
}

async function getNotesByOwnerId(ownerId: string) {
    return await Note.find({ owner: ownerId });
}

async function deleteNote(noteId: string, userId: string) {
    const note = await getNoteIfAuthorized(noteId, userId);
    await note.deleteOne();
    return { message: 'Note deleted successfully' };
}

async function updateNote(
    noteId: string,
    userId: string,
    newTitle: string | undefined,
    newBody: string | undefined,
    name: string | undefined
) {
    const note = await getNoteIfAuthorized(noteId, userId);
    note.title = newTitle || note.title;
    note.body = newBody || note.body;
    note.name = name || note.name;
    await note.save();
    return note;
}

export { getNoteById, createNote, getNotesByOwnerId, deleteNote, updateNote };
