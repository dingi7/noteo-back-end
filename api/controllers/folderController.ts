import { Context, Hono } from 'hono';
import { checkAuthorization } from '../services/auth';
import {
    createFolder,
    deleteFolder,
    editFolder,
    getFolderById,
    getFoldersByOwnerId,
} from '../services/folderService';

const folderController = new Hono();
interface FolderPayload {
    [key: string]: any;
    name: string;
}

folderController
    .post('/folders', async (c: Context) => {
        const reqBody = await c.req.json<FolderPayload>();
        const user = checkAuthorization(c);
        if (!reqBody.name) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const name = reqBody['name'];
        const result = await createFolder(name, user._id);
        return c.json(result, 201);
    })
    .get(async (c: Context) => {
        const user = checkAuthorization(c);
        if (!user?._id) {
            return c.json({ error: 'Missing required fields' }, 400);
        }
        const result = await getFoldersByOwnerId(user._id);
        return c.json(result, 200);
    });

folderController
    .put('/folders/:folderId', async (c: Context) => {
        const reqBody = await c.req.json<FolderPayload>();
        const folderId = c.req.param('folderId');
        const user = checkAuthorization(c);
        if (!folderId || !reqBody.name || !user?._id) {
            return c.json(
                { error: 'Missing required fields or unauthorized' },
                400
            );
        }
        const name = reqBody['name'].toString();
        const result = await editFolder(folderId, name, user!._id);
        return c.json(result, 200);
    })
    .delete(async (c: Context) => {
        const folderId = c.req.param('folderId');
        const user = checkAuthorization(c);
        if (!folderId || !user?._id) {
            return c.json(
                { error: 'Missing required fields or unauthorized' },
                400
            );
        }
        const result = await deleteFolder(folderId, user!._id);
        return c.json(result, 200);
    })
    .get(async (c: Context) => {
        const foldeId = c.req.param('folderId');
        const user = checkAuthorization(c);
        if (!foldeId || !user?._id) {
            return c.json(
                { error: 'Missing required fields or unauthorized' },
                400
            );
        }
        const folder = await getFolderById(foldeId, user!._id);
        return c.json(folder, 200);
    });

export default folderController;
