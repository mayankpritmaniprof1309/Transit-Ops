import axios from 'axios';

const LOCAL_STORAGE_KEY = 'transitops_mock_trips';

const DEFAULT_TRIPS = [
  { id: 1, route: 'NY to Boston', driver: 'John Doe', vehicle: 'Truck-001', status: 'In Progress', date: '2026-07-12' },
  { id: 2, route: 'LA to SF', driver: 'Jane Smith', vehicle: 'Van-003', status: 'Completed', date: '2026-07-10' },
  { id: 3, route: 'Chicago to Detroit', driver: 'Mike Ross', vehicle: 'Truck-005', status: 'Scheduled', date: '2026-07-15' },
];

const getStoredTrips = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TRIPS));
    return DEFAULT_TRIPS;
  }
  return JSON.parse(stored);
};

const saveStoredTrips = (trips) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
};

class TripService {
  async getAllTrips() {
    // In a real app: return await axios.get('/api/trips');
    return new Promise(resolve => setTimeout(() => resolve({ data: getStoredTrips() }), 500));
  }

  async getTripById(id) {
    // In a real app: return await axios.get(`/api/trips/${id}`);
    const trips = getStoredTrips();
    const trip = trips.find(t => t.id === parseInt(id));
    return new Promise(resolve => setTimeout(() => resolve({ data: trip }), 500));
  }

  async createTrip(tripData) {
    // In a real app: return await axios.post('/api/trips', tripData);
    const trips = getStoredTrips();
    const nextId = trips.length > 0 ? Math.max(...trips.map(t => t.id)) + 1 : 1;
    const newTrip = { ...tripData, id: nextId };
    trips.push(newTrip);
    saveStoredTrips(trips);
    return new Promise(resolve => setTimeout(() => resolve({ data: newTrip }), 500));
  }

  async deleteTrip(id) {
    // In a real app: return await axios.delete(`/api/trips/${id}`);
    const trips = getStoredTrips();
    const index = trips.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      trips.splice(index, 1);
      saveStoredTrips(trips);
    }
    return new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 500));
  }

  async updateTrip(id, tripData) {
    // In a real app: return await axios.put(`/api/trips/${id}`, tripData);
    const trips = getStoredTrips();
    const index = trips.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      trips[index] = { ...trips[index], ...tripData };
      saveStoredTrips(trips);
      return new Promise(resolve => setTimeout(() => resolve({ data: trips[index] }), 500));
    }
    return Promise.reject(new Error('Trip not found'));
  }
}

export default new TripService();
