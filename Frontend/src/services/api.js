// Setting BASE_URL with a fallback to localhost if the environment variable is not available
export const BASE_URL = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : "http://localhost:3000";

export const endpoints = {
  // Auth endpoints
  SIGNUP_API: `${BASE_URL}/api/auth/signup`, // done
  SIGNUP_REPRESENTATIVE_API: `${BASE_URL}/api/auth/signup-representative`, // done
  LOGIN_API: `${BASE_URL}/api/auth/login`, // done

  // Admin endpoints
  CREATE_TASK_API: `${BASE_URL}/api/admin/create-task`, // done
  ASSIGN_TASK_API: `${BASE_URL}/api/admin/assign-task`, // done
  GET_REPRESENTATIVES_API: `${BASE_URL}/api/admin/representatives`,
  GET_ADMIN_TASKS_API: `${BASE_URL}/api/admin/tasks`, // done
  UPLOAD_CSV_API: `${BASE_URL}/api/admin/upload-csv`, // done
  GET_CUSTOMERS_API: `${BASE_URL}/api/admin/customers`,//done

  // Representative endpoints
  GET_ASSIGNED_TASKS_API: `${BASE_URL}/api/representative/assigned-tasks`, // done

  // Task management
  UPDATE_TASK_API: `${BASE_URL}/api/tasks/update`, //done
  DELETE_TASK_API: `${BASE_URL}/api/tasks/delete`, //done
  GET_TASK_STATS_API: `${BASE_URL}/api/tasks/stats`, //done

  // Call and communication
  GET_USERS_CALL_LIST: `${BASE_URL}/api/users/call-list`,
  SEND_EMAILS_TO_USER: `${BASE_URL}/api/users/send-email`, // done
  CALL_COMPLETION: `${BASE_URL}/api/call/completion`
};
