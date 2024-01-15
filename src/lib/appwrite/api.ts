import { ID, Query } from 'appwrite';
import { INewNote, IUser } from '../../types';
import { account, appwriteConfig, databases } from './config';

export async function createNewUser(user: IUser) {
  try {
    const newUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );
    if (!newUser) throw new Error('Не удалось создать пользователя');

    await saveUserToDB({
      accountId: newUser.$id,
      email: user.email,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  username: string;
}) {
  try {
    const isUserSaved = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      { accountId: user.accountId, email: user.email, username: user.username }
    );

    if (!isUserSaved)
      throw new Error('Не удалось сохранить пользователя в базу данных');

    return isUserSaved;
  } catch (error) {
    throw error;
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function signInUser(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    if (!session) throw new Error('Не удалось войти');

    return session;
  } catch (error) {
    throw error;
  }
}

export async function signOutUser(id: string) {
  try {
    const deletedSession = account.deleteSession(id);

    return deletedSession;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw new Error('Не удалось получить пользователя');

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllNotes(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    return user.notes;
  } catch (error) {
    throw error;
  }
}

export async function createNewNote(note: INewNote, userId: string) {
  try {
    const newNote = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      ID.unique(),
      note
    );

    if (!newNote) throw new Error('Не удалось создать заметку');

    const allNotes = await getAllNotes(userId);

    if (!allNotes) {
      const savedNote = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId,
        { notes: note }
      );

      if (!savedNote) throw new Error('Не удалось создать заметку');

      return { newNote, savedNote };
    } else {
      const savedNote = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId,
        { notes: [...allNotes, note] }
      );

      if (!savedNote) throw new Error('Не удалось создать заметку');

      return { newNote, savedNote };
    }
  } catch (error) {
    throw error;
  }
}

export async function saveNote(noteId: string, note: INewNote) {
  try {
    const savedNote = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      noteId,
      note
    );

    if (!savedNote) throw new Error('Не удалось сохранить заметку');

    return savedNote;
  } catch (error) {
    throw error;
  }
}

export async function deleteNote(id: string) {
  try {
    const deletedNote = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.notesCollectionId,
      id
    );

    if (!deletedNote) throw new Error('Не удалось удалить заметку');
  } catch (error) {
    throw error;
  }
}
