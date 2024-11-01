import { toast } from "react-hot-toast";
import {
  setLoading,
  setTasks,
  setError,
  addTask as addTaskAction,
  updateTask as updateTaskAction,
  deleteTask as deleteTaskAction,
} from "../../slices/taskSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const {
  GET_ASSIGNED_TASKS_API,
  CREATE_TASK_API,
  UPDATE_TASK_API,
  DELETE_TASK_API,
  GET_TASK_STATS_API,
} = endpoints;

const dummyTasks = [
  {
    _id: 1,
    customerName: "Customer One",
    projectTitle: "Project Alpha",
    description: "Initial phase of Project Alpha.",
    script: "Analyze the project requirements and create a basic blueprint.",
    assignedTo: "John Doe",
    status: "COMPLETED",
    lastUpdated: "2024-10-31",
    keywords: ["development", "frontend"],
  },
  {
    _id: 2,
    customerName: "Customer Two",
    projectTitle: "Project Beta",
    description: "Developing the user interface for Project Beta.",
    script: "Create UI mockups and get client feedback.",
    assignedTo: "Jane Smith",
    status: "IN_PROGRESS",
    lastUpdated: "2024-10-30",
    keywords: ["UI/UX", "design"],
  },
  {
    _id: 3,
    customerName: "Customer Three",
    projectTitle: "Project Gamma",
    description: "Testing and deployment phase of Project Gamma.",
    script: "Conduct final testing and prepare for deployment.",
    assignedTo: "Alice Johnson",
    status: "PENDING",
    lastUpdated: "2024-10-29",
    keywords: ["testing", "deployment"],
  },
  {
    _id: 4,
    customerName: "Customer Four",
    projectTitle: "Project Delta",
    description: "Initial planning and design for Project Delta.",
    script: "Outline project goals and deliverables.",
    assignedTo: "Mark Brown",
    status: "COMPLETED",
    lastUpdated: "2024-10-28",
    keywords: ["planning", "strategy"],
  },
  {
    _id: 5,
    customerName: "Customer Five",
    projectTitle: "Project Epsilon",
    description: "Data analysis and reporting for Project Epsilon.",
    script: "Gather data and create analytical reports.",
    assignedTo: "Emma Wilson",
    status: "IN_PROGRESS",
    lastUpdated: "2024-10-27",
    keywords: ["data", "analytics"],
  },
  {
    _id: 6,
    customerName: "Customer Six",
    projectTitle: "Project Zeta",
    description: "Final review and feedback for Project Zeta.",
    script: "Collect feedback from stakeholders and finalize documentation.",
    assignedTo: "Michael Davis",
    status: "PENDING",
    lastUpdated: "2024-10-26",
    keywords: ["review", "feedback"],
  },
];

// Fetch tasks with simulated API call
export const fetchTasks = () => async (dispatch) => {
  dispatch(setLoading(true)); // Set loading state to true

  try {
    // Simulate network delay with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch(setTasks(dummyTasks)); // Dispatch the action to set tasks
  } catch (error) {
    dispatch(setError(error.message)); // Dispatch error action if something goes wrong
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};
// Create new task (Admin only)
export const createTask = (taskData) => {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Creating task...");
    dispatch(setLoading(true));

    try {
      const {
        task: { userRole },
      } = getState();

      if (userRole !== "Admin") {
        throw new Error("Unauthorized: Only Admins can create tasks");
      }

      const response = await makeAuthenticatedRequest(dispatch, getState, {
        method: "POST",
        url: CREATE_TASK_API,
        data: taskData,
      });

      dispatch(addTaskAction(response.task));
      toast.success("Task created successfully");
      return response.task;
    } catch (error) {
      console.error("Create task error:", error);
      toast.error(handleApiError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
};

// Update existing task (Admin only)
export const updateTask = (taskId, updateData) => {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Updating task...");
    dispatch(setLoading(true));

    try {
      const {
        task: { userRole },
      } = getState();

      if (userRole !== "Admin") {
        throw new Error("Unauthorized: Only Admins can update tasks");
      }

      const response = await makeAuthenticatedRequest(dispatch, getState, {
        method: "PUT",
        url: `${UPDATE_TASK_API}/${taskId}`,
        data: updateData,
      });

      dispatch(updateTaskAction(response.task));
      toast.success("Task updated successfully");
      return response.task;
    } catch (error) {
      console.error("Update task error:", error);
      toast.error(handleApiError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
};

// Delete task (Admin only)
export const deleteTask = (taskId) => {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Deleting task...");
    dispatch(setLoading(true));

    try {
      const {
        task: { userRole },
      } = getState();

      if (userRole !== "Admin") {
        throw new Error("Unauthorized: Only Admins can delete tasks");
      }

      await makeAuthenticatedRequest(dispatch, getState, {
        method: "DELETE",
        url: `${DELETE_TASK_API}/${taskId}`,
      });

      dispatch(deleteTaskAction(taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error(handleApiError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
};

// Get task statistics
export const getTaskStats = () => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        task: { userRole },
        auth: { user },
      } = getState();
      const params =
        userRole === "Representative" ? { assignedTo: user._id } : {};

      const response = await makeAuthenticatedRequest(dispatch, getState, {
        method: "GET",
        url: GET_TASK_STATS_API,
        params,
      });

      return response.stats;
    } catch (error) {
      console.error("Fetch stats error:", error);
      toast.error(handleApiError(error));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
