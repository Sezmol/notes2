import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Models } from 'appwrite';

interface INoteState {
  id: string;
  title: string;
  content: string;
  isListsMenuActive: boolean;
}

const initialState: INoteState = {
  id: '',
  title: '',
  content: '',
  isListsMenuActive: true,
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setActiveNote(state, action: PayloadAction<Models.Document>) {
      state.id = action.payload.$id;
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    changeNoteTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    changeNoteContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
    clearActiveNote(state) {
      state.content = '';
      state.id = '';
      state.title = '';
      state.isListsMenuActive = true;
    },
    toggleListsMenu(state) {
      state.isListsMenuActive = !state.isListsMenuActive;
    },
  },
});

export const {
  setActiveNote,
  changeNoteTitle,
  changeNoteContent,
  clearActiveNote,
  toggleListsMenu,
} = noteSlice.actions;

export default noteSlice.reducer;
