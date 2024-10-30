export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const endpoints = {
  // Auth endpoints
  SIGNUP_API: `${BASE_URL}/api/auth/signup`,
  LOGIN_API: `${BASE_URL}/api/auth/login`,

  // Admin endpoints
  CREATE_TASK_API: `${BASE_URL}/api/admin/create-task`,
  ASSIGN_TASK_API: `${BASE_URL}/api/admin/assign-task`,
  GET_REPRESENTATIVES_API: `${BASE_URL}/api/admin/representatives`,
  GET_ADMIN_TASKS_API: `${BASE_URL}/api/admin/tasks`,
  UPLOAD_CSV_API: `${BASE_URL}/api/admin/upload-csv`,
  GET_CUSTOMERS_API: `${BASE_URL}/api/admin/customers`,

  // Representative endpoints
  GET_ASSIGNED_TASKS_API: `${BASE_URL}/api/representative/assigned-tasks`,

  // Task management
  UPDATE_TASK_API: `${BASE_URL}/api/tasks/update`, 
  DELETE_TASK_API: `${BASE_URL}/api/tasks/delete`,
  GET_TASK_STATS_API: `${BASE_URL}/api/tasks/stats`,

  // Call and communication
  GET_USERS_CALL_LIST: `${BASE_URL}/api/users/call-list`,
  SEND_EMAILS_TO_USER: `${BASE_URL}/api/users/send-email`,
  CALL_COMPLETION: `${BASE_URL}/api/call/completion`
};