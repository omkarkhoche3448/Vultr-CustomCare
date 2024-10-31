// services/adminServices.js
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  endpoints
} from '../api';

const {
    CREATE_TASK_API, 
    ASSIGN_TASK_API, 
    GET_ADMIN_TASKS_API, 
    GET_REPRESENTATIVES_API, 
    GET_CUSTOMERS_API, 
    UPLOAD_CSV_API 
}= endpoints;

// Service to create a new task
export const createTask = async (taskData) => {
    const toastId = toast.loading('Creating task...');
    try {
        const response = await axios.post(CREATE_TASK_API, taskData);
        toast.success('Task created successfully!', { id: toastId });
        console.log('Task created:', response.data);
        return response.data; // Return the created task data
    } catch (error) {
        toast.error('Error creating task', { id: toastId });
        console.error('Error creating task:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Service to assign a task to a representative
export const assignTask = async (assignmentData) => {
    const toastId = toast.loading('Assigning task...');
    try {
        const response = await axios.post(ASSIGN_TASK_API, assignmentData);
        toast.success('Task assigned successfully!', { id: toastId });
        console.log('Task assigned:', response.data);
        return response.data; // Return the response data
    } catch (error) {
        toast.error('Error assigning task', { id: toastId });
        console.error('Error assigning task:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Service to fetch all tasks
export const fetchTasks = async () => {
    const toastId = toast.loading('Fetching tasks...');
    try {
        const response = await axios.get(GET_ADMIN_TASKS_API);
        toast.success('Tasks fetched successfully!', { id: toastId });
        console.log('Tasks fetched:', response.data);
        return response.data; // Return the list of tasks
    } catch (error) {
        toast.error('Error fetching tasks', { id: toastId });
        console.error('Error fetching tasks:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Service to fetch all representatives
export const fetchRepresentatives = async () => {
    const toastId = toast.loading('Fetching representatives...');
    try {
        const response = await axios.get(GET_REPRESENTATIVES_API);
        toast.success('Representatives fetched successfully!', { id: toastId });
        console.log('Representatives fetched:', response.data);
        return response.data; // Return the list of representatives
    } catch (error) {
        toast.error('Error fetching representatives', { id: toastId });
        console.error('Error fetching representatives:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Service to fetch customers
export const fetchCustomers = async () => {
    const toastId = toast.loading('Fetching customers...');
    try {
        const response = await axios.get(`${GET_CUSTOMERS_API}?filename=customer.csv`);
        toast.success('Customers fetched successfully!', { id: toastId });
        console.log('Customers fetched:', response.data);
        return response.data; // Return the list of customers
    } catch (error) {
        toast.error('Error fetching customers', { id: toastId });
        console.error('Error fetching customers:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Service to upload a CSV file
export const uploadCSV = async (csvFile) => {
    const formData = new FormData();
    formData.append('file', csvFile);

    const toastId = toast.loading('Uploading CSV...');
    try {
        const response = await axios.post(UPLOAD_CSV_API, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('CSV uploaded successfully!', { id: toastId });
        console.log('CSV uploaded:', response.data);
        return response.data; // Return the response after upload
    } catch (error) {
        toast.error('Error uploading CSV', { id: toastId });
        console.error('Error uploading CSV:', error);
        throw error; // Rethrow the error for further handling
    }
};
