import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/Auth/PrivateRoute";
import SignIn from "./components/Auth/Signin";
import SignUp from "./components/Auth/Signup";
import SalespersonDashboard from "./components/SalespersonDashboard/SalespersonDashboard"; 
// import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
// import NotFound from "./components/NotFound"; // Optional: Add a NotFound component

export default function App() {
  return (
    <Routes>
      {/* Salesperson Dashboard */}
      <Route
        path="/dashboard/*" // Using route parameters for userRole and userId
        element={
          <PrivateRoute>
            <SalespersonDashboard />
          </PrivateRoute>
        }
      />

      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Catch-All Route */}
      <Route 
        path="/signin" 
        element={<SignIn />} // Optional: Show "Not Found" instead of redirecting to the dashboard
      />
    </Routes>
  );
}
