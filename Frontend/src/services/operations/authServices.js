import { toast } from "react-hot-toast";
import { setLoading, setUser, logout as logoutAction, setError } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const { SIGNUP_API, LOGIN_API } = endpoints;

export function signUp(userData) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your account...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("POST", SIGNUP_API, userData);
      
      console.log("Service Response:", response);
      return response;

    } catch (error) {
      console.error("Signup Error:", error);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to create account";
      
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
      
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function signIn(credentials) {
  return async (dispatch) => {
    const toastId = toast.loading("Signing you in...");
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await apiConnector("POST", LOGIN_API, credentials);
    
    // Check if we have both token and user in the response
    if (response.data.token && response.data.user) {
      const userData = {
        user: {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role
        },
        token: response.data.token
      };

      dispatch(setUser(userData));
      toast.success("Welcome back!");
      dispatch(setLoading(false));
      toast.dismiss(toastId);
      
      return userData;
    }
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    navigate("/");
  };
}