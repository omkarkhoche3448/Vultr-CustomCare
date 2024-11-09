// services/adminServices.js
import axios from "axios";
import { toast } from "react-hot-toast";
import { endpoints } from "../api";
import { setCustomers } from "../../slices/customerSlice";
import { setTasks, setError, setLoading } from "../../slices/taskSlice";

export const BASE_URL =
  typeof import.meta.env !== "undefined" && import.meta.env.VITE_BASE_URL
    ? import.meta.env.VITE_BASE_URL
    : "http://localhost:3000";

const {
  CREATE_TASK_API,
  ASSIGN_TASK_API,
  GET_ADMIN_TASKS_API,
  GET_REPRESENTATIVES_API,
  GET_CUSTOMERS_API,
  UPLOAD_CSV_API,
} = endpoints;

export const createTask = async (taskData, token) => {
  console.log("Creating task...");
  const toastId = toast.loading("Creating task...");
  try {
    const response = await axios.post(CREATE_TASK_API, taskData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Task created successfully!", { id: toastId });
    return response.data;
  } catch (error) {
    toast.error("Error creating task", { id: toastId });
    throw error;
  }
};

export const fetchTasks = (token) => async (dispatch) => {
  console.log("Token:", token);
  console.log("Fetching tasks...");
  try {
    dispatch(setLoading(true));
    const response = await axios.get(GET_ADMIN_TASKS_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Ensure response.data is an array
    const tasksArray = Array.isArray(response.data) ? response.data : [];
    dispatch(setTasks(tasksArray));
    dispatch(setLoading(false));
    return tasksArray;
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    throw error;
  }
};

export const fetchRepresentatives = async (token) => {
  console.log("Fetching representatives...");
  try {
    const response = await axios.get(GET_REPRESENTATIVES_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching representatives:", error);
    throw new Error();
    // error.response?.data?.message || "Failed to fetch representatives"
  }
};

export const fetchCustomers =
  (token, filename = "customers.csv") =>
  async (dispatch) => {
    console.log("Fetching customers...");
    try {
      const storedCustomers = JSON.parse(localStorage.getItem("customers"));
      if (storedCustomers?.length) {
        dispatch(setCustomers(storedCustomers));
        return storedCustomers;
      }

      const response = await axios.get(GET_CUSTOMERS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { filename },
      });

      dispatch(setCustomers(response.data.data));
      localStorage.setItem("customers", JSON.stringify(response.data.data));
      return response.data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

export const uploadCSV = async (csvFile, token, onProgress) => {
  console.log("Uploading CSV...");
  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const response = await axios.post(UPLOAD_CSV_API, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: onProgress,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateScript = async (description, task, GenaiToken, token) => {
  console.log("Generating script....");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/generate-script`,
      {
        description,
        task,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "genai-auth": GenaiToken,
        },
      }
    );

    if (response.data && response.data.script) {
      console.log("Script generated successfully.");
      return response.data.script;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Script generation error:", error);
    throw error;
  }
};

export const generateKeywords = async (script, task, GenaiToken, token) => {
  console.log("Generating keywords...");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/generate-keywords`,
      {
        script,
        task,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "genai-auth": GenaiToken,
        },
      }
    );

    if (
      !response.data["personal Keywords"] ||
      !response.data["product keywords"]
    ) {
      throw new Error("Invalid keyword response format");
    }

    return {
      personalKeywords: response.data["personal Keywords"]
        .split(", ")
        .filter((k) => k),
      productKeywords: response.data["product keywords"]
        .split(", ")
        .filter((k) => k),
    };
  } catch (error) {
    console.error("Keyword generation error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to generate keywords"
    );
  }
};

export const fetchStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalTasks: 2,
        completedTasks: 0,
        pendingTasks: 2,
        teamMembers: 2,
      });
    }, 500);
  });
};

export const fetchRecentActivity = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          action: "New task assigned",
          project: "Website Redesign",
          time: "2 hours ago",
          status: "pending",
        },
        {
          id: 2,
          action: "Task completed",
          project: "Mobile App Update",
          time: "4 hours ago",
          status: "completed",
        },
        {
          id: 3,
          action: "New team member added",
          project: "API Integration",
          time: "6 hours ago",
          status: "in-progress",
        },
        {
          id: 4,
          action: "New task assigned",
          project: "Website Redesign",
          time: "2 hours ago",
          status: "pending",
        },
        {
          id: 5,
          action: "New task assigned",
          project: "Website Redesign",
          time: "2 hours ago",
          status: "pending",
        },
        {
          id: 6,
          action: "New task assigned",
          project: "Website Redesign",
          time: "2 hours ago",
          status: "pending",
        },
        {
          id: 7,
          action: "New task assigned",
          project: "Website Redesign",
          time: "2 hours ago",
          status: "pending",
        },
        {
          id: 8,
          action: "New task assigned",
          project: "Website Redesign",
          time: "2 hours ago",
          status: "pending",
        },
      ]);
    }, 500);
  });
};

export const fetchDeadlines = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "Website Launch",
          due: "Due in 2 days",
        },
        {
          title: "Team Meeting",
          due: "Tomorrow at 10:00 AM",
        },
        {
          title: "Project Review",
          due: "Next week",
        },
        {
          title: "Website Launch",
          due: "Due in 2 days",
        },
        {
          title: "Team Meeting",
          due: "Tomorrow at 10:00 AM",
        },
        {
          title: "Project Review",
          due: "Next week",
        },
      ]);
    }, 500);
  });
};
