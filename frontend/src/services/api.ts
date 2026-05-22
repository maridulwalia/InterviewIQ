import axios from "axios";

const normalizeApiBaseUrl = (url: string) => {
  const trimmedUrl = url.replace(/\/$/, "");
  return trimmedUrl.endsWith("/api") ? trimmedUrl : `${trimmedUrl}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
);

export const BACKEND_BASE_URL = API_BASE_URL.slice(0, -"/api".length);

export const getBackendUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log(`[API Response] ${res.config.url}:`, res.data);
    return res;
  },
  (error) => {
    const token = localStorage.getItem("token");
    console.error(`[API Error] ${error.config?.url}:`, error.response?.status, error.response?.data);

    if (error.response?.status === 401 && token) {
      console.warn("401 Unauthorized with valid token - Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  signup: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/signup", data),
};

export interface Resume {
  _id: string;
  originalName: string;
  fileUrl: string;
  extractedText: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export const resumeApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getMyResume: () => api.get<{ success: boolean; resume: Resume | null }>("/resume/me"),
  delete: (id: string) => api.delete(`/resume/${id}`),
};

export interface AnswerFeedback {
  score: number; // 0-10
  feedback: string;
  missingPoints: string[];
  improvementSuggestion: string;
}

export interface InterviewConfig {
  role?: string;
  difficulty?: string;
  total?: number;
  technical?: number;
  hr?: number;
  behavioral?: number;
  aptitude?: number;
  technicalCategories?: string[];
  regenerate?: boolean;
}

export const interviewApi = {
  getQuestions: (config: InterviewConfig) =>
    api.post("/questions", config),
  submitAnswer: (data: { questionId: string; answerText: string; sessionId?: string }) =>
    api.post<AnswerFeedback>("/answers", data),
};

export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number;
  bestArea: string;
  performanceOverTime: { date: string; score: number }[];
  topicPerformance: { topic: string; score: number }[];
  weakAreas: { topic: string; score: number }[];
  recommendations: { title: string; description: string }[];
}

export const analyticsApi = {
  getOverview: () => api.get<AnalyticsData>("/analytics"),
};

export default api;
