export const apiFetch = (endpoint, options = {}) => {
  return fetch(`/api/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
      ...options.headers
    }
  });
};