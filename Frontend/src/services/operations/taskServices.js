import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const {
  GET_ASSIGNED_TASKS_API,
  CREATE_TASK_API,
  UPDATE_TASK_API,
  DELETE_TASK_API,
  GET_TASK_STATS_API,
} = endpoints;

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
export const updateTask = async (taskData, token) => {

  try {
    const response = await apiConnector("PUT", UPDATE_TASK_API, taskData, {
      Authorization: `Bearer ${token}`,
    });
    toast.success("Task updated successfully", { id: toastId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task");
    toast.error("Failed to update task");
  }
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
