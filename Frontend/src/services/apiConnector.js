import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
  console.log("Method:", method);
  console.log("URL:", url);
  console.log("Body Data:", bodyData);
  console.log("Headers:", headers);
  console.log("Params:", params);

  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};