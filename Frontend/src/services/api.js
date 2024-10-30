export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5174";

export const endpoints = {
  SIGNUP_API: `${BASE_URL}/user/login`,
  LOGIN_API: `${BASE_URL}admin/login`,
  GET_USERS_CALL_LIST: `${BASE_URL}/admin/users`,
  SEND_EMAILS_TO_USER: `${BASE_URL}/send-email`,
  ADD_TASK: `${BASE_URL}/admin/tasks/add-tasks`,
  DASHBOARD_METRICS: `${BASE_URL}/admin/dashboard/metrics`,
  USER_TASKS: (salesId) => `${BASE_URL}/representative/${salesId}/tasks`,
  CALL_COMPLETION: `${BASE_URL}/representative/call-completion`,
};
