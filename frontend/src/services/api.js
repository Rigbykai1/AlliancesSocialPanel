import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export const postsApi = {
  getAll:      ()         => api.get('/posts'),
  getById:     (id)       => api.get(`/posts/${id}`),
  create:      (data)     => api.post('/posts', data),
  update:      (id, data) => api.put(`/posts/${encodeURIComponent(id)}`, data),
  delete:      (id, fecha) => api.delete(`/posts/${encodeURIComponent(id)}?fecha=${fecha}`),
  generate:    (tema)     => api.post('/posts/generate', { tema }),
  generateMeta: (payload) => api.post('/posts/meta', payload)
}

export default api