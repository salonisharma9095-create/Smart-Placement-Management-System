import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ===== Interceptor: har request ke saath automatically token attach karo =====
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Auth APIs =====
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);

// ===== Student APIs =====
export const getMyProfile = () => API.get("/students/profile");
export const updateMyProfile = (profileData) => API.put("/students/profile", profileData);

// ===== Company APIs =====
export const getCompanies = () => API.get("/companies");
export const createCompany = (companyData) => API.post("/companies", companyData);
export const updateCompany = (id, companyData) => API.put(`/companies/${id}`, companyData);
export const deleteCompany = (id) => API.delete(`/companies/${id}`);

// ===== Application APIs =====
export const applyToCompany = (companyId) => API.post("/applications", { companyId });
export const getMyApplications = () => API.get("/applications/my");
export const getAllApplications = () => API.get("/applications");
export const updateApplicationStatus = (id, status) => API.put(`/applications/${id}/status`, { status });

// ===== Approval API =====
export const updateApprovalStatus = (id, status) => API.put(`/companies/${id}/approve`, { status });

// ===== Resume Upload API =====
export const uploadResume = (formData) =>
  API.post("/students/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;