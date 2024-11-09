import axios from "axios";
import { setAssignedTasks, setError, setLoading } from "../../slices/representativesSlice";
import { endpoints } from "../api";

const { GET_REP_TASKS_API } = endpoints;

export const fetchRepresentativeTasks = (token, user) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.get(GET_REP_TASKS_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        user: user,
      },
    });
    console.log("response", response);

    const transformedTasks = response.data.map((task) => ({
      taskId: task.taskId,
      category: task.category,
      customers: task.customers,
      projectTitle: task.projectTitle,
      description: task.description,
      script: task.script,
      keywords: task.keywords,
      assignedMembers: task.assignedMembers,
      status: task.status,
      priority: task.priority,
      assignedDate: task.assignedDate,
      dueDate: task.dueDate,
    }));
    console.log("transformedTasks", transformedTasks);

    dispatch(setAssignedTasks(transformedTasks));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch tasks"));
  } finally {
    dispatch(setLoading(false)); 
  }
};
