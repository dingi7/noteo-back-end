import {
    registerUser,
    loginUser,
    checkAuthorization,
    toggleAutoSave,
} from '../services/auth';
import { Context, Hono } from 'hono';
import { RegisterPayload } from '../../interfaces/RegisterPayload';

const router = new Hono();

router.post('/register', async (c: Context) => {
    const reqBody = await c.req.json<RegisterPayload>();
    if (
        !reqBody.username ||
        !reqBody.password ||
        !reqBody.email ||
        !reqBody.firstName
    ) {
        return c.json({ error: 'Missing required fields' }, 400);
    }
    const result = await registerUser(reqBody);
    return c.json(result, 201);
});

router.post('/login', async (c: Context) => {
    const reqBody = await c.req.json<RegisterPayload>();
    if ((!reqBody.username && !reqBody.email) || !reqBody.password) {
        return c.json({ error: 'Missing required fields' }, 400);
    }
    const result = await loginUser(reqBody);
    return c.json(result, 200); // probably should be 404 if user not found
});

router.post('/autoSave', async (c: Context) => {
    const { autoSave } = await c.req.json();
    const user = checkAuthorization(c);
    if (!user?._id) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    const result = await toggleAutoSave(user._id, autoSave);
    return c.json(result, 200);
});

router.post('/logout', async (c: Context) => {
    return c.json({ message: 'Not implemented' }, 501);
});

export default router;
