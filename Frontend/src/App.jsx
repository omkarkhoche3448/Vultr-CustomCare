// App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
// import PrivateRoute from "./components/Auth/PrivateRoute"; 
import SignIn from "./components/Auth/Signin";
import SignUp from "./components/Auth/Signup";
import Dashboard from "./Dashboard"; 

export default function App() {
  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          // <PrivateRoute>
            <Dashboard />
          // </PrivateRoute>
        }
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Redirect to dashboard by default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
