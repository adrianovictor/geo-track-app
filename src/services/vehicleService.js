import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5108/api'
});

export const vehicleService = ({
  list: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/Vehicles?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/Vehicles/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/Vehicles', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/Vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/Vehicles/${id}`);
    return response.data;
  },

  uploadRoutePositions: async (file, onProgress) => {

    if (!file) {
      throw new Error('Nenhum arquivo selecionado');
    }

    if (!file.name.endsWith('.json')) {
      throw new Error('Apenas arquivos JSON são permitidos');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo: 10MB`);
    }

    const formData = new FormData();
    formData.append('file', file);


    try {
      const response = await api.post('/Vehicles/upload-vehicles-route-positions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        }
      });

      return response.data;

    } catch (err) {
      const msg = err.response?.data?.error || 'Erro no upload';
      throw new Error(msg);
    }
  },    

});