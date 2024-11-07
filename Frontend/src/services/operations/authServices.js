import { toast } from "react-hot-toast";
import { setLoading, setUser, logout as logoutAction, setError } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const { SIGNUP_API, LOGIN_API,SIGNUP_REPRESENTATIVE_API } = endpoints;

export function signUp(userData) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your account..."); 
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("POST", SIGNUP_API, userData);
      console.log("Service Response:", response);
      toast.success("Account created successfully!", { id: toastId }); 
      return response;

    } catch (error) {
      console.error("Signup Error:", error);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to create account";
      
      dispatch(setError(errorMessage));
      toast.error(errorMessage, { id: toastId });
      
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function SignUpRepresentative(userData) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating representative account...");
    dispatch(setLoading(true));
    
    try {
      const representativeData = {
        ...userData,
        role: "Representative"
      };
      
      const response = await apiConnector(
        "POST", 
        SIGNUP_REPRESENTATIVE_API, 
        representativeData
      );
      
      console.log("Representative Signup Response:", response);
      toast.success("Representative account created successfully!", { id: toastId });
      return response;

    } catch (error) {
      console.error("Representative Signup Error:", error);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to create representative account";
      
      dispatch(setError(errorMessage));
      toast.error(errorMessage, { id: toastId });
      
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function signIn(credentials) {
  return async (dispatch) => {
    const toastId = toast.loading("Signing you in...");
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await apiConnector("POST", LOGIN_API, credentials);
      
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
        toast.success("Welcome back!", { id: toastId }); 
        return userData;
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to sign in";
      
      dispatch(setError(errorMessage));
      toast.error(errorMessage, { id: toastId });
      throw error;
      
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    
    return (navigate) => {
      navigate("/");
    };
  };
}