import { Hono } from 'hono';
import folders from './controllers/folderController';
import users from './controllers/usersController';
import notes from './controllers/noteController';

const api = new Hono();

api.route('/auth', users);
api.route('/items', folders);
api.route('/items', notes);

export default api;
