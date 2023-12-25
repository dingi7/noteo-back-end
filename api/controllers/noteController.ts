import { Context, Hono } from 'hono';
import {
    createNote,
    deleteNote,
    getNoteById,
    getNotesByOwnerId,
    updateNote,
} from '../services/noteService';
import { checkAuthorization } from '../services/auth';

const noteController = new Hono();

interface notePayload {
    [key: string]: any; // Adding index signature
    name: string;
    title?: string;
    body?: string;
    folderId: string;
}

noteController
    .get('/notes/:noteId', async (c: Context) => {
        const noteId = c.req.param('noteId');
        const user = checkAuthorization(c);
        if (!noteId || !user?._id) {
            return c.json(
                { error: 'Missing required fields or unathrozired' },
                400
            );
        }
        const result = await getNoteById(noteId, user._id);
        return c.json(result, 200);
    })
    .delete(async (c: Context) => {
        const noteId = c.req.param('noteId');
        const user = checkAuthorization(c);
        if (!noteId || !user?._id) {
            return c.json(
                { error: 'Missing required fields or unathrozired' },
                400
            );
        }
        const result = await deleteNote(noteId, user._id);
        return c.json(result, 200);
    })
    .put(async (c: Context) => {
        const noteId = c.req.param('noteId');
        const user = checkAuthorization(c);
        if (!noteId || !user?._id) {
            return c.json(
                { error: 'Missing required fields or unathrozired' },
                400
            );
        }
        const { title, body } = await c.req.json<notePayload>();
        const result = await updateNote(noteId, user._id, title, body);
        return c.json(result, 200);
    });

noteController
    .post('/notes', async (c: Context) => {
        const { name, folderId } = await c.req.json<notePayload>();
        const { _id } = checkAuthorization(c);

        if (!name || !folderId || !_id) {
            return c.json(
                { error: 'Missing required fields or unathorized' },
                400
            );
        }
        const result = await createNote(name, folderId, _id);
        return c.json(result, 200);
    })
    .get(async (c: Context) => {
        const user = checkAuthorization(c);
        if (!user?._id) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const result = await getNotesByOwnerId(user._id);
        return c.json(result, 200);
    });

export default noteController;
