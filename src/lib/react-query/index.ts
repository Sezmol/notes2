import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { INewNote, IUser } from '../../types';
import {
  createNewNote,
  createNewUser,
  deleteNote,
  getAllNotes,
  getCurrentUser,
  saveNote,
  saveUserToDB,
  signInUser,
} from '../appwrite/api';

export const useCreateNewUser = () =>
  useMutation({
    mutationFn: (user: IUser) => createNewUser(user),
  });

export const useSaveUserToDB = () =>
  useMutation({
    mutationFn: (user: {
      accountId: string;
      email: string;
      username: string;
    }) => saveUserToDB(user),
  });

export const useGetCurrentUser = () =>
  useMutation({ mutationFn: () => getCurrentUser() });

export const useSignInUser = () =>
  useMutation({
    mutationFn: (user: { email: string; password: string }) => signInUser(user),
  });

export const useCreateNewNote = (note: INewNote, userId: string) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => createNewNote(note, userId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useGetAllNotes = (userId: string) =>
  useQuery({ queryFn: () => getAllNotes(userId), queryKey: ['notes'] });

export const useSaveNote = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, note }: { noteId: string; note: INewNote }) =>
      saveNote(noteId, note),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteNote = (id: string) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteNote(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
