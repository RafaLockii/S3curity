import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000/',    
})

api.interceptors.request.use(
    async (config) => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const token = parsedUser.token;

            if (token) {
                config.headers.Authorization = `${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

