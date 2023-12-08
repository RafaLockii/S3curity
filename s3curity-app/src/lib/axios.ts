import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
//http://localhost:3000/
export const api = axios.create({
    baseURL: baseUrl,    
})
//asdas
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

