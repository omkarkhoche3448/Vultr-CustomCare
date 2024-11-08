import axios from "axios";

// Create an axios instance with the baseURL and default headers
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Set baseURL directly here
  headers: {
    'Content-Type': 'application/json'
  }
});

// Define the API connector function to handle various requests
export const apiConnector = (method, url, bodyData = null, options = {}) => {
  console.log("Method:", method);
  console.log("URL:", url);
  console.log("Body Data:", bodyData);
  console.log("Options:", options);

  // Extract headers and params from options
  const { headers = {}, params = {} } = options;

  return axiosInstance({
    method: method,
    url: url,
    data: bodyData,
    headers: headers,
    params: params
  });
};
