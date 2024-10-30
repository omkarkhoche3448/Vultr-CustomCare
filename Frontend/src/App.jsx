import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/Auth/PrivateRoute";
import SignIn from "./components/Auth/Signin";
import SignUp from "./components/Auth/Signup";
import SalespersonDashboard from "./components/SalespersonDashboard/SalespersonDashboard"; 
// import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Route for Admin Dashboard with user ID */}
      {/* <Route
        path="/admin/dashboard/:userId/*"
        element={
          // <PrivateRoute>
            <AdminDashboard />
          // </PrivateRoute>
        }
      /> */}

      {/* Route for Salesperson Dashboard with user ID */}
      <Route
        path="/salesperson/dashboard/:userId/*"
        element={
          // <PrivateRoute>
            <SalespersonDashboard />
          // </PrivateRoute>
        }
      />

      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Catch-All Route */}
      <Route 
        path="*" 
        element={
          // Uncomment below to protect the route with PrivateRoute
          // <PrivateRoute>
            <SalespersonDashboard />
          // </PrivateRoute>
        } 
      />
    </Routes>
  );
}
