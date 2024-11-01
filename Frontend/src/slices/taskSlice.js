import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    loading: false,
    error: null,
    userRole: null, 
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setTasks: (state, action) => {
            state.tasks = action.payload;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
            state.error = null;
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
                state.error = null;
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task._id !== action.payload);
            state.error = null;
        },
        setUserRole: (state, action) => {
            state.userRole = action.payload;
        }
    },
});

export const {
    setLoading,
    setTasks,
    setError,
    addTask,
    updateTask,
    deleteTask,
    setUserRole,
} = taskSlice.actions;

export default taskSlice.reducer;
