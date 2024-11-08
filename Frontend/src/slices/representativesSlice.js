import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  representatives: [],
  assignedTasks: [],
  loading: false,
  error: null,
};

const representativesSlice = createSlice({
  name: "representatives",
  initialState,
  reducers: {
    setRepresentatives(state, action) {
      state.representatives = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAssignedTasks(state, action) {
      state.assignedTasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload ?? true;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setRepresentatives,
  setAssignedTasks,
  setLoading,
  setError,
} = representativesSlice.actions;

export default representativesSlice.reducer;