import api from './api.js';

class TripService {
  async getAllTrips() {
    const response = await api.get('/trips');
    return response.data;
  }

  async getTripById(id) {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  }

  async createTrip(tripData) {
    const response = await api.post('/trips', tripData);
    return response.data;
  }

  async updateTrip(id, tripData) {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  }

  async deleteTrip(id) {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  }

  async dispatchTrip(id, dispatchData) {
    const response = await api.patch(`/trips/${id}/dispatch`, dispatchData);
    return response.data;
  }

  async completeTrip(id, completionData) {
    const response = await api.patch(`/trips/${id}/complete`, completionData);
    return response.data;
  }

  async cancelTrip(id) {
    const response = await api.patch(`/trips/${id}/cancel`);
    return response.data;
  }
}

export default new TripService();
