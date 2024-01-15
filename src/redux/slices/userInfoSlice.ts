import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { INewUser } from '../../types';

interface IUserInfoState {
  sessionId: string;
  user: INewUser;
  isAuth: boolean;
}

interface IAuthenticateUserAction {
  user: INewUser;
  sessionId: string;
}

const emptyUser = {
  id: '',
  email: '',
  username: '',
};

const initialState: IUserInfoState = {
  sessionId: '',
  isAuth: false,
  user: {
    id: '',
    email: '',
    username: '',
  },
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    authenticateUser(state, action: PayloadAction<IAuthenticateUserAction>) {
      state.isAuth = true;
      state.sessionId = action.payload.sessionId;
      state.user = action.payload.user;
    },
    unauthenticateUser(state) {
      state.isAuth = false;
      state.sessionId = '';
      state.user = emptyUser;
    },
  },
});

export const { authenticateUser, unauthenticateUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;
