import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null,
  token: localStorage.getItem('token')
    ? JSON.parse(localStorage.getItem('token'))
    : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('token', JSON.stringify(action.payload.token));
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setLoading, setError, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
