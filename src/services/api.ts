import axios from 'axios';

export const api = axios.create({
    // Tenta ler a nuvem primeiro. Se não achar, usa o local como reserva.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

// Interceptor: Antes de QUALQUER requisição, ele executa isso
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@rpg:token');

    if (token) {
        // Adiciona o Bearer Token que o seu Middleware do Node espera
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});