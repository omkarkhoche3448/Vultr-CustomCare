// services/adminServices.js
import axios from "axios";
import { toast } from "react-hot-toast";
import { endpoints } from "../api";
import { setCustomers } from "../../slices/customerSlice";
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

// Service to create a new task
export const createTask = async (taskData) => {
  const toastId = toast.loading("Creating task...");
  try {
    const response = await axios.post(CREATE_TASK_API, taskData);
    toast.success("Task created successfully!", { id: toastId });
    console.log("Task created:", response.data);
    return response.data; // Return the created task data
  } catch (error) {
    toast.error("Error creating task", { id: toastId });
    console.error("Error creating task:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Service to fetch all tasks
export const fetchTasks = async () => {
  const toastId = toast.loading("Fetching tasks...");
  try {
    const response = await axios.get(GET_ADMIN_TASKS_API);
    toast.success("Tasks fetched successfully!", { id: toastId });
    console.log("Tasks fetched:", response.data);
    return response.data; // Return the list of tasks
  } catch (error) {
    toast.error("Error fetching tasks", { id: toastId });
    console.error("Error fetching tasks:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Service to fetch all representatives
export const fetchRepresentatives = async (token) => {
  console.log("Fetching representatives...");
  const toastId = toast.loading("Fetching representatives...");
  try {
    const response = await axios.get(GET_REPRESENTATIVES_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Representatives fetched successfully!", { id: toastId });
    console.log("Representatives fetched:", response.data);
    window.location.reload();
    return response.data;
  } catch (error) {
    toast.error("Error fetching representatives", { id: toastId });
    console.error("Error fetching representatives:", error);
    throw error;
  }
};

// Service to fetch customers
export const fetchCustomers =
  (token, filename = "customers.csv") =>
  async (dispatch) => {
    console.log("Fetching customers...");
    const toastId = toast.loading("Fetching customers...");

    try {
      const response = await axios.get(GET_CUSTOMERS_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filename,
        },
      });

      dispatch(setCustomers(response.data.data));
      toast.success("Customer fetched successfully!", { id: toastId });
      console.log("Customers fetched:", response.data.data);
      return response.data;
    } catch (error) {
      toast.error("Error fetching Customers", { id: toastId });
      console.error("Error fetching Customers:", error);
    }
  };

// Service to upload a CSV file
export const uploadCSV = async (csvFile, token, onProgress) => {
  const formData = new FormData();
  formData.append("file", csvFile);

  const toastId = toast.loading("Uploading CSV...");
  try {
    const response = await axios.post(UPLOAD_CSV_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: onProgress,
    });

    toast.success("CSV uploaded successfully!", { id: toastId });
    console.log("CSV uploaded:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    toast.error(error?.response?.data?.message || "Error uploading CSV", {
      id: toastId,
    });
    throw error;
  }
};

export const fetchStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalTasks: 245,
        completedTasks: 182,
        pendingTasks: 63,
        teamMembers: 12,
      });
    }, 500); // Simulating a delay
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

export const generateScript = async (description, task, GenaiToken) => {
  console.log("Generating scriptS....");
  try {
    const response = await axios.post(
      `http://localhost:3000/api/admin/generate-script`,
      {
        description,
        task,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GenaiToken}`,
        },
      }
    );

    // return "This is a dummy generated script based on provided description and task.";

    if (response.data && response.data.script) {
      console.log("Script generated successfully.");
      return response.data.script;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Script generation error:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.error || `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(error.message || "Failed to generate script");
    }
  }
};

export const generateKeywords = async (script, task, GenaiToken) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/admin/generate-keywords`,
      {
        script,
        task,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GenaiToken}`,
        },
      }
    );

    // return {
    //   personalKeywords: ["dummyPersonalKeyword1", "dummyPersonalKeyword2"],
    //   productKeywords: ["dummyProductKeyword1", "dummyProductKeyword2"],
    // };

    return {
      personalKeywords: response.data["personal Keywords"].split(", "),
      productKeywords: response.data["product keywords"].split(", "),
    };
  } catch (error) {
    console.error("Keyword generation error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to generate keywords"
    );
  }
};
