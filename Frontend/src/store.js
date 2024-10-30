import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import taskReducer from "./slices/authSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    task:  taskReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
