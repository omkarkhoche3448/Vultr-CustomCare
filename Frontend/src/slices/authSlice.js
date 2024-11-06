import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setUser: (state, action) => {
      try {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.isLoading = false;
        state.error = null;
        
        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
      } catch (error) {
        console.error("Error setting user data:", error);
        state.error = "Failed to save user data";
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("representatives"); 
      localStorage.removeItem("customers"); 
      // localStorage.removeItem("tasks"); 
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setLoading, setError, setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;