import api from './api.js';

class MaintenanceService {
  async getAllMaintenanceRecords() {
    const response = await api.get('/maintenance');
    return response.data;
  }

  async getMaintenanceById(id) {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  }

  async createMaintenanceRecord(recordData) {
    const response = await api.post('/maintenance', recordData);
    return response.data;
  }

  async updateMaintenanceRecord(id, recordData) {
    const response = await api.put(`/maintenance/${id}`, recordData);
    return response.data;
  }

  async deleteMaintenanceRecord(id) {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data;
  }
}

export default new MaintenanceService();
