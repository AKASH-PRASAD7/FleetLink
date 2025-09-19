const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8000";
};

export const apiUrl = getApiUrl();
