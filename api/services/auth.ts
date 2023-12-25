import { IUser } from './../../interfaces/User';
import bcrypt from 'bcrypt';
import { RegisterPayload } from '../../interfaces/RegisterPayload';
import User from '../../models/userModel';
import { ISession } from '../../interfaces/Session';
import jsonwebtoken from 'jsonwebtoken';
import { AuthContext } from '../../interfaces/AuthContext';
const JWT_SECRET = process.env.JWT_SECRET || 'process.env.JWT_SECRET;';

async function validatePassword(inputPassword: string, storedPassword: string) {
    const match = await bcrypt.compare(inputPassword, storedPassword);
    if (!match) {
        throw new Error('Invalid password');
    }
}

async function hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function registerUser(userPayload: RegisterPayload) {
    const alUser = await User.findOne({ email: userPayload.email });
    if (alUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await hashPassword(userPayload.password);
    const user = new User({
        firstName: userPayload.firstName,
        username: userPayload.username,
        email: userPayload.email,
        hashedPassword: hashedPassword,
    });
    await user.save();
    return createSession(user);
}

async function loginUser(userPayload: RegisterPayload) {
    const userByUsername = await User.findOne<IUser>({
        username: userPayload.username,
    });

    const userByEmail = await User.findOne<IUser>({
        email: userPayload.email,
    });

    const user = userByUsername || userByEmail;

    if (!user) {
        throw new Error('User not found');
    }

    await validatePassword(userPayload.password, user.hashedPassword);
    return createSession(user);
}

async function getUserById(id: string) {
    return await User.findById(id);
}

function createSession(user: IUser): ISession {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        accessToken: jsonwebtoken.sign({ _id: user._id }, JWT_SECRET),
    };
}

function verifySession(token: string) {
    const data = jsonwebtoken.verify(token, JWT_SECRET) as ISession;
    return data;
}

function checkAuthorization(c: AuthContext): ISession {
    if (c.user) {
        return c.user;
    } else {
        throw new Error('Unauthorized');
    }
}

export {
    registerUser,
    loginUser,
    getUserById,
    verifySession,
    checkAuthorization,
};
