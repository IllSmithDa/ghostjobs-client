import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    isAuth: boolean;
    isadmin: boolean;
    username: string;
    email?: string,
    uid?: string,
    userImage?: string;
    strikes: number;
    isbanned:boolean;
  }
}

const initialState = {
  user: {
    isAuth: false,
    isadmin: false,
    username: '',
    email: '',
    uid: '',
    userImage: '',
    strikes: 0,
    isbanned: false,
  }
} as AuthState;

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{username: string, isadmin: boolean, strikes:number, isbanned: boolean }>) => {
      state.user = {
        isadmin: action.payload.isadmin,
        isAuth: true,
        username: action.payload.username,
        strikes: action.payload.strikes,
        isbanned: action.payload.isbanned,
      }
    },
    logoutUser: () => {
      return initialState;
    },
  }
})

export const { loginUser, logoutUser } = auth.actions;
export default auth.reducer;