import axios from 'axios';
import { config } from '../configs/config.js';

const BASE_URL = config.servicioA.url;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const bibliotecaClient = {
  async getBooks(params = {}) {
    const response = await apiClient.get('/books', { params });
    return response.data;
  },

  async getBookById(id) {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  async checkAvailability(bookId) {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data.data?.disponible ?? false;
  },

  async getActiveLoans(params = {}) {
    const response = await apiClient.get('/loans', { params: { ...params, estado: 'activo' } });
    return response.data;
  }
};
