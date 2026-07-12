import api from './api.js';

class TripService {
  /**
   * GET /api/trips
   * Returns { success, data: [...trips] }
   */
  async getAllTrips(params = {}) {
    const res = await api.get('/trips', { params });
    return res.data; // { success, data }
  }

  /**
   * GET /api/trips/:id
   */
  async getTripById(id) {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  }

  /**
   * POST /api/trips
   */
  async createTrip(tripData) {
    const res = await api.post('/trips', tripData);
    return res.data;
  }

  /**
   * PUT /api/trips/:id
   */
  async updateTrip(id, tripData) {
    const res = await api.put(`/trips/${id}`, tripData);
    return res.data;
  }

  /**
   * DELETE /api/trips/:id
   */
  async deleteTrip(id) {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  }

  /**
   * PATCH /api/trips/:id/dispatch
   */
  async dispatchTrip(id) {
    const res = await api.patch(`/trips/${id}/dispatch`);
    return res.data;
  }

  /**
   * PATCH /api/trips/:id/complete
   */
  async completeTrip(id, body = {}) {
    const res = await api.patch(`/trips/${id}/complete`, body);
    return res.data;
  }

  /**
   * PATCH /api/trips/:id/cancel
   */
  async cancelTrip(id) {
    const res = await api.patch(`/trips/${id}/cancel`);
    return res.data;
  }
}

export default new TripService();
