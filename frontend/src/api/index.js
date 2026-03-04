import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const employeeService = {
    getAll: () => api.get('/employees'),
    create: (data) => api.post('/employees', data),
    delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceService = {
    mark: (data) => api.post('/attendance', data),
    getByEmployee: (id) => api.get(`/attendance/${id}`),
};

export const dashboardService = {
    getSummary: (date) => api.get('/dashboard/summary', { params: { date } }),
};

export default api;
