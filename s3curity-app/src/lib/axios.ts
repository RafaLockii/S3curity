import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000/',    
})

// api.interceptors.request.use(
//     async (config) => {
//         const storedUser = localStorage.getItem('user');

//         if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             const token = parsedUser.token;

//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default api;

// // Interceptor de resposta para erros 404 (Recurso não encontrado)
// axios.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       if (error.response && error.response.status === 404) {
//         // Trate o erro 404 aqui, talvez definindo uma mensagem de erro personalizada
//         return Promise.reject(new Error('Recurso não encontrado'));
//       }
//       return Promise.reject(error);
//     }
//   );
  
//   // Interceptor de resposta para erros 401 (Não autorizado)
//   axios.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         // Trate o erro 401 aqui, talvez redirecionando o usuário para a página de login
//         return Promise.reject(new Error('Não autorizado'));
//       }
//       return Promise.reject(error);
//     }
//   );