const API_BASE_URL = 'http://localhost:5108/api';

export const vehicleService = {
  getVehicles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/Vechicles?${queryString}`);
    return response.json();
  },

  getVehicleById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Vechicles/${id}`);
    return response.json();
  },
  
  createVehicle: async (data) => {
    const response = await fetch(`${API_BASE_URL}/Vechicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  updateVehicle: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/Vechicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  deleteVehicle: async (id) => {
    const response = await fetch(`${API_BASE_URL}/Vechicles/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
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

    const response = await fetch(`${API_BASE_URL}/Vechicles/upload-vehicles-route-positions`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro no upload: ${response.statusText}`);
    }

    return response.json();
  },  
};