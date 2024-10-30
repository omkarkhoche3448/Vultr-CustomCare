import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const { GET_USERS_CALL_LIST, SEND_EMAILS_TO_USER } = endpoints;

// Fetch Users Service
export const fetchUsers = async () => {
  const toastId = toast.loading("Fetching users...");
  try {
    const response = await apiConnector("POST", GET_USERS_CALL_LIST);

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();
    console.log("Fetched users:", users);
    toast.success("Users fetched successfully!");
    return users; 
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Error fetching users: " + error.message);
    throw error; 
  } finally {
    toast.dismiss(toastId);
  }
};

// Send Invite Service
export const sendInvite = async (userId) => {
  const toastId = toast.loading(`Sending invite to user ${userId}...`);
  try {
    const response = await apiConnector("POST", `${SEND_EMAILS_TO_USER}/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to send invite");
    }

    const data = await response.json();
    console.log(`Invite sent to user ${userId}:`, data);
    toast.success(`Invite sent to ${data.email} successfully!`);
    return data; 
  } catch (error) {
    console.error("Error sending invite:", error);
    toast.error("Error sending invite: " + error.message);
    throw error; 
  } finally {
    toast.dismiss(toastId); 
  }
};
