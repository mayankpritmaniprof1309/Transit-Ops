import axios from 'axios';

// Mock data for Trip
const MOCK_TRIPS = [
  { id: 1, route: 'NY to Boston', driver: 'John Doe', vehicle: 'Truck-001', status: 'In Progress', date: '2026-07-12' },
  { id: 2, route: 'LA to SF', driver: 'Jane Smith', vehicle: 'Van-003', status: 'Completed', date: '2026-07-10' },
  { id: 3, route: 'Chicago to Detroit', driver: 'Mike Ross', vehicle: 'Truck-005', status: 'Scheduled', date: '2026-07-15' },
];

class TripService {
  async getAllTrips() {
    // In a real app: return await axios.get('/api/trips');
    return new Promise(resolve => setTimeout(() => resolve({ data: MOCK_TRIPS }), 500));
  }

  async getTripById(id) {
    // In a real app: return await axios.get(`/api/trips/${id}`);
    const trip = MOCK_TRIPS.find(t => t.id === parseInt(id));
    return new Promise(resolve => setTimeout(() => resolve({ data: trip }), 500));
  }

  async createTrip(tripData) {
    // In a real app: return await axios.post('/api/trips', tripData);
    const newTrip = { ...tripData, id: Math.random() };
    return new Promise(resolve => setTimeout(() => resolve({ data: newTrip }), 500));
  }

  async deleteTrip(id) {
    // In a real app: return await axios.delete(`/api/trips/${id}`);
    return new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 500));
  }
}

export default new TripService();
