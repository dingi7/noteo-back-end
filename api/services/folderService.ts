import { getUserById } from './auth';
import Folder from '../../models/folderModel';
import Note from '../../models/noteModel';

async function createFolder(name: string, owner: string) {
    const folder = new Folder({
        name,
        owner,
    });
    await folder.save();
    return folder;
}

async function getFolderById(folderId: string, ownerId: string) {
    const folder = await getFolderIfAuthorized(folderId, ownerId);
    return folder;
}

async function editFolder(
    folderId: string,
    name: string,
    ownerId: string,
) {

    const folder = await getFolderIfAuthorized(folderId, ownerId);
    folder.name = name || folder.name;

    await folder.save();
    return folder;
}

async function deleteFolder(boardId: string, ownerId: string) {
    const folder = await getFolderIfAuthorized(boardId, ownerId);
    for (const note of folder.notes) {
        await Note.findByIdAndDelete(note._id);
    }
    await folder.deleteOne();
    return { message: 'Folder deleted successfully' };
}

async function getFolderIfAuthorized(folderId: string, ownerId: string) {
    const folder = await Folder.findById(folderId);
    if (!folder) {
        throw new Error('Board not found');
    }
    const owner = await getUserById(ownerId);
    if (!folder.owner.equals(owner!._id)) {
        throw new Error('Unauthorized access to folder');
    }
    return (await folder.populate('notes'));
}

export const getFoldersByOwnerId = async (ownerId: string) => {
    const folders = await Folder.find({ owner: ownerId }).populate('notes');
    return folders;
};

export {
    createFolder,
    editFolder,
    deleteFolder,
    getFolderById,
};
