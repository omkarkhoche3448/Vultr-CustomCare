import axios from "axios";
import { setTasks, setError, setLoading } from "../../slices/taskSlice";
import { endpoints } from "../api";

const { GET_REP_TASKS_API } = endpoints;

export const fetchRepresentativeTasks = (token) => async (dispatch) => {
  console.log("Fetching representative tasks...");
  try {
    dispatch(setLoading(true));
    const response = await axios.get(GET_REP_TASKS_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Transform the response to match the frontend structure
    const transformedTasks = response.data.map(task => ({
      _id: task.taskId,
      projectTitle: task.title,
      customerName: task.customerNames[0]?.name || 'N/A',
      description: task.description,
      assignedTo: "Representative",
      status: "PENDING", // You might want to add status in backend response
      lastUpdated: task.createdAt
    }));

    dispatch(setTasks(transformedTasks));
    dispatch(setLoading(false));
    return transformedTasks;
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
    throw error;
  }
};