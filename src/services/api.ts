import axios from 'axios';

export const api = axios.create({
    /* Usamos localhost porque o seu navegador (client) vai tentar 
    acessar a API na porta que você expôs no Docker do backend. */
    baseURL: 'http://localhost:3333'
});