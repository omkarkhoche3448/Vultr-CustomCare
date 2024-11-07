import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import taskReducer from "./slices/taskSlice";
import customerReducer from "./slices/customerSlice";
import representativesReducer from "./slices/representativesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    customers: customerReducer, 
    representatives: representativesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;