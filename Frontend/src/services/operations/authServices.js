import { toast } from "react-hot-toast";
import { setLoading, setUser, logout as logoutAction, setError } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const { SIGNUP_API, LOGIN_API } = endpoints;

export function signUp(userData) {
  return async (dispatch) => {
    const toastId = toast.loading("Signing up...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, userData);
      console.log("SIGN-UP RESPONSE:", response); 
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Registration successful!");
      return response.data; 
    } catch (error) {
      console.error("SIGN-UP ERROR:", error);
      dispatch(setError(error?.response?.data?.message || "Registration failed."));
      toast.error(error?.response?.data?.message || "Registration failed.");
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Sign-in service function
export function signIn(credentials) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, credentials);
      console.log("LOGIN RESPONSE:", response); // Log the response

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login successful!");

      const userData = {
        user: {
          ...response.data.user,
        },
        token: response.data.token
      };
      dispatch(setUser(userData));

      return userData; // Return user data for further use
    } catch (error) {
      console.error("LOGIN ERROR:", error); // Log the error
      dispatch(setError(error?.response?.data?.message || "Login failed."));
      toast.error(error?.response?.data?.message || "Login failed.");
      throw error; // Rethrow error for further handling in component
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Logout service function
export function logout(navigate) {
  return (dispatch) => {
    dispatch(logoutAction());
    toast.success("Logged Out");
    navigate("/");
  };
}
