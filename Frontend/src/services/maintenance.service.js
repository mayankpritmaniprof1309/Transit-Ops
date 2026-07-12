import axios from 'axios';

// Mock data for Maintenance
const MOCK_MAINTENANCE = [
  { id: 1, vehicle: 'Truck-001', type: 'Oil Change', status: 'Pending', cost: 150, date: '2026-07-13' },
  { id: 2, vehicle: 'Van-002', type: 'Tire Replacement', status: 'Completed', cost: 400, date: '2026-07-01' },
  { id: 3, vehicle: 'Truck-005', type: 'Engine Check', status: 'In Progress', cost: 1200, date: '2026-07-12' },
];

class MaintenanceService {
  async getAllMaintenanceRecords() {
    // In a real app: return await axios.get('/api/maintenance');
    return new Promise(resolve => setTimeout(() => resolve({ data: MOCK_MAINTENANCE }), 500));
  }

  async getMaintenanceById(id) {
    // In a real app: return await axios.get(`/api/maintenance/${id}`);
    const record = MOCK_MAINTENANCE.find(m => m.id === parseInt(id));
    return new Promise(resolve => setTimeout(() => resolve({ data: record }), 500));
  }

  async createMaintenanceRecord(recordData) {
    // In a real app: return await axios.post('/api/maintenance', recordData);
    const newRecord = { ...recordData, id: Math.random() };
    return new Promise(resolve => setTimeout(() => resolve({ data: newRecord }), 500));
  }

  async deleteMaintenanceRecord(id) {
    // In a real app: return await axios.delete(`/api/maintenance/${id}`);
    return new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 500));
  }
}

export default new MaintenanceService();
