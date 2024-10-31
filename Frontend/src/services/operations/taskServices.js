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

// Enhanced error handler utility
const handleApiError = (error) => {
    if (error.response) {
        return error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
        return 'Network error: Unable to reach server';
    }
    return error.message || 'An unexpected error occurred';
};

// Generic API request handler with authentication
const makeAuthenticatedRequest = async (dispatch, getState, requestConfig) => {
    const { auth: { token } } = getState();
    
    if (!token) {
        throw new Error('Authentication required');
    }

    // Log the request configuration
    console.log('Request config:', {
        ...requestConfig,
        headers: {
            ...requestConfig.headers,
            Authorization: `Bearer ${token}`
        }
    });

    const response = await apiConnector(
        requestConfig.method,
        requestConfig.url,
        requestConfig.data,
        {
            headers: {
                ...requestConfig.headers,
                Authorization: `Bearer ${token}`
            },
            params: requestConfig.params
        }
    );

    return response.data;
};

// Fetch tasks with pagination and filtering
export const fetchTasks = (filters = {}) => {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Loading tasks...");
        dispatch(setLoading(true));

        try {
            const { auth: { user } } = getState();
            
            const queryParams = {
                ...filters,
                userName: user.username,
                page: filters.page || 1,
                limit: filters.limit || 20
            };

            const response = await makeAuthenticatedRequest(dispatch, getState, {
                method: "GET",
                url: GET_ASSIGNED_TASKS_API,
                params: queryParams
            });

            if (response.success) {
                const processedTasks = processTasksResponse(response.tasks || [], queryParams);
                console.log(processedTasks)
                dispatch(setTasks(processedTasks));
                return processedTasks;
            } else {
                throw new Error(response.message || 'Failed to fetch tasks');
            }

        } catch (error) {
            console.error("Fetch tasks error:", error);
            toast.error(handleApiError(error));
            throw error;
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

// Helper function to process tasks response
const processTasksResponse = (tasks, queryParams) => {
    const { page = 1, limit = 20, status } = queryParams;
    
    const filteredTasks = status && status !== 'ALL'
        ? tasks.filter(task => task.status === status)
        : tasks;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
        activeTasks: filteredTasks.slice(startIndex, endIndex),
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredTasks.length / limit),
            hasNext: endIndex < filteredTasks.length,
            hasPrevious: page > 1,
            total: filteredTasks.length
        }
    };
};

// Create new task (Admin only)
export const createTask = (taskData) => {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Creating task...");
        dispatch(setLoading(true));

        try {
            const { task: { userRole } } = getState();
            
            if (userRole !== "Admin") {
                throw new Error("Unauthorized: Only Admins can create tasks");
            }

            const response = await makeAuthenticatedRequest(dispatch, getState, {
                method: "POST",
                url: CREATE_TASK_API,
                data: taskData
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
}

// Update existing task (Admin only)
export const updateTask = (taskId, updateData) => {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Updating task...");
        dispatch(setLoading(true));

        try {
            const { task: { userRole } } = getState();
            
            if (userRole !== "Admin") {
                throw new Error("Unauthorized: Only Admins can update tasks");
            }

            const response = await makeAuthenticatedRequest(dispatch, getState, {
                method: "PUT",
                url: `${UPDATE_TASK_API}/${taskId}`,
                data: updateData
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
}

// Delete task (Admin only)
export const deleteTask = (taskId) => {
    return async (dispatch, getState) => {
        const toastId = toast.loading("Deleting task...");
        dispatch(setLoading(true));

        try {
            const { task: { userRole } } = getState();
            
            if (userRole !== "Admin") {
                throw new Error("Unauthorized: Only Admins can delete tasks");
            }

            await makeAuthenticatedRequest(dispatch, getState, {
                method: "DELETE",
                url: `${DELETE_TASK_API}/${taskId}`
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
}

// Get task statistics
export const getTaskStats = () => {
    return async (dispatch, getState) => {
        dispatch(setLoading(true));

        try {
            const { task: { userRole }, auth: { user } } = getState();
            const params = userRole === "Representative" ? { assignedTo: user._id } : {};

            const response = await makeAuthenticatedRequest(dispatch, getState, {
                method: "GET",
                url: GET_TASK_STATS_API,
                params
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
}
