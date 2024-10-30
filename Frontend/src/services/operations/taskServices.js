import { toast } from "react-hot-toast";
import { 
    setLoading, 
    setTasks, 
    setError,
    addTask as addTaskAction,
    updateTask as updateTaskAction,
    deleteTask as deleteTaskAction 
} from "../../slices/taskSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";

const {
    GET_ASSIGNED_TASKS_API,
    CREATE_TASK_API,
    UPDATE_TASK_API,
    DELETE_TASK_API,
    GET_TASK_STATS_API
} = endpoints;

// Fetch tasks based on filters, accessible to both admin and salesperson roles
export function fetchTasks(filters = {}) {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Fetching tasks...");
        dispatch(setLoading(true));
        try {
            const { task: { userRole }, auth: { user } } = getState();
            const queryFilters = {
                ...filters,
                ...(userRole === "salesperson" ? { assignedTo: user._id } : {})
            };

            const response = await apiConnector("GET", GET_ASSIGNED_TASKS_API, null, { params: queryFilters });

            if (!response.data.success) throw new Error(response.data.message);

            dispatch(setTasks(response.data.tasks));
            return response.data.tasks;
        } catch (error) {
            console.error("FETCH TASKS ERROR:", error);
            const errorMessage = error?.response?.data?.message || "Failed to fetch tasks";
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

// Create a new task (Admin only)
export function createTask(taskData) {
    return async (dispatch, getState) => {
        const { task: { userRole } } = getState();
        if (userRole !== "admin") {
            toast.error("Unauthorized: Only admins can create tasks");
            return;
        }

        const toastId = toast.loading("Creating task...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", CREATE_TASK_API, taskData);

            if (!response.data.success) throw new Error(response.data.message);

            dispatch(addTaskAction(response.data.task));
            toast.success("Task created successfully!");
            return response.data.task;
        } catch (error) {
            console.error("CREATE TASK ERROR:", error);
            const errorMessage = error?.response?.data?.message || "Failed to create task";
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

// Update an existing task (Admin only)
export function updateTask(taskId, updateData) {
    return async (dispatch, getState) => {
        const { task: { userRole } } = getState();
        if (userRole !== "admin") {
            toast.error("Unauthorized: Only admins can update tasks");
            return;
        }

        const toastId = toast.loading("Updating task...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PUT", `${UPDATE_TASK_API}/${taskId}`, updateData);

            if (!response.data.success) throw new Error(response.data.message);

            dispatch(updateTaskAction(response.data.task));
            toast.success("Task updated successfully!");
            return response.data.task;
        } catch (error) {
            console.error("UPDATE TASK ERROR:", error);
            const errorMessage = error?.response?.data?.message || "Failed to update task";
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

// Delete a task (Admin only)
export function deleteTask(taskId) {
    return async (dispatch, getState) => {
        const { task: { userRole } } = getState();
        if (userRole !== "admin") {
            toast.error("Unauthorized: Only admins can delete tasks");
            return;
        }

        const toastId = toast.loading("Deleting task...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("DELETE", `${DELETE_TASK_API}/${taskId}`);

            if (!response.data.success) throw new Error(response.data.message);

            dispatch(deleteTaskAction(taskId));
            toast.success("Task deleted successfully!");
            return response.data;
        } catch (error) {
            console.error("DELETE TASK ERROR:", error);
            const errorMessage = error?.response?.data?.message || "Failed to delete task";
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

// Fetch task statistics, accessible to both roles but filtered by role
export function getTaskStats() {
    return async (dispatch, getState) => {
        dispatch(setLoading(true));
        try {
            const { task: { userRole }, auth: { user } } = getState();
            const params = userRole === "salesperson" ? { assignedTo: user._id } : {};

            const response = await apiConnector("GET", GET_TASK_STATS_API, null, { params });

            if (!response.data.success) throw new Error(response.data.message);

            return response.data.stats;
        } catch (error) {
            console.error("FETCH STATS ERROR:", error);
            const errorMessage = error?.response?.data?.message || "Failed to fetch statistics";
            dispatch(setError(errorMessage));
            toast.error(errorMessage);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
}
