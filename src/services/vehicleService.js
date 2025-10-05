const API_BASE_URL = 'http://localhost:5108/api';

export const vehicleService = {
  getVehicles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/Vechicles?${queryString}`);
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
  }
};