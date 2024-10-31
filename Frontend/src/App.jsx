import { Route, Routes, Navigate } from "react-router-dom"; 
import PrivateRoute from "./components/Auth/PrivateRoute";
import SignIn from "./components/Auth/Signin";
import SignUp from "./components/Auth/Signup";
import SalespersonDashboard from "./components/SalespersonDashboard/SalespersonDashboard"; 
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Admin Dashboard Route */}
      <Route
        path="/admin-dashboard/*"
        element={
          <PrivateRoute requiredRole="Admin"> {/* Set requiredRole to "admin" */}
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Salesperson Dashboard Route */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute requiredRole="Representative"> {/* Set requiredRole to "salesperson" */}
            <SalespersonDashboard />
          </PrivateRoute>
        }
      />

      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Optional: Catch-All Route */}
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
}
