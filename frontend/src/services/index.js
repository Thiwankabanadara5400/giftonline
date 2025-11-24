import api from './api.js';

export const authService = {
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (data) => 
    api.put('/auth/profile', data)
};

export const productService = {
  getAll: () => 
    api.get('/products'),
  
  getById: (id) => 
    api.get(`/products/${id}`),
  
  create: (data) => 
    api.post('/products', data),
  
  update: (id, data) => 
    api.put(`/products/${id}`, data),
  
  delete: (id) => 
    api.delete(`/products/${id}`)
};

export const categoryService = {
  getAll: () => 
    api.get('/categories'),
  
  getById: (id) => 
    api.get(`/categories/${id}`),
  
  create: (data) => 
    api.post('/categories', data),
  
  update: (id, data) => 
    api.put(`/categories/${id}`, data),
  
  delete: (id) => 
    api.delete(`/categories/${id}`)
};

export const reviewService = {
  getAll: () => 
    api.get('/reviews'),
  
  getByProduct: (productId) => 
    api.get(`/reviews/product/${productId}`),
  
  create: (data) => 
    api.post('/reviews', data),
  
  update: (id, data) => 
    api.put(`/reviews/${id}`, data),
  
  delete: (id) => 
    api.delete(`/reviews/${id}`)
};
