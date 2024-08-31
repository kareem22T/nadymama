// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  name: string | null;
  token: string | null;
  isAuthentication: boolean;
}

const initialState: AuthState = {
  name: "",
  token: null,
  isAuthentication: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ name: string, token: string}>) => {
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.isAuthentication = true;
    },
    clearCredentials: (state) => {
      state.name = null;
      state.isAuthentication = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
