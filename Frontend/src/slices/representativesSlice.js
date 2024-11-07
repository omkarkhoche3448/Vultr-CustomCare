import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  representatives: [],
  loading: false,
  error: null,
};

const representativesSlice = createSlice({
  name: 'representatives',
  initialState,
  reducers: {
    setRepresentatives(state, action) {
      state.representatives = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setRepresentatives, setLoading, setError } = representativesSlice.actions;
export default representativesSlice.reducer;