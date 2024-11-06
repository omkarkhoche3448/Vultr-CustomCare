import { createSlice } from '@reduxjs/toolkit';

const storedRepresentatives = JSON.parse(localStorage.getItem('representatives')) || [];

const representativesSlice = createSlice({
  name: 'representatives',
  initialState: {
    representatives: storedRepresentatives, 
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    setRepresentatives(state, action) {
      state.loading = false;
      state.representatives = action.payload;
      localStorage.setItem('representatives', JSON.stringify(action.payload));
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setRepresentatives, setError } = representativesSlice.actions;
export default representativesSlice.reducer;
