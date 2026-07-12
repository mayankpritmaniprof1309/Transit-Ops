/**
 * Register all core Socket.IO event listeners on client connection.
 * @param {Object} io - The Socket.IO server instance.
 */
export const registerSocketEvents = (io) => {
  io.on('connection', (socket) => {
    const connectionTime = new Date().toISOString();
    console.log(`Client connected: Socket ID = ${socket.id} at ${connectionTime}`);

    // Room Support: Allow clients to join rooms
    socket.on('joinRoom', (data) => {
      if (data && data.room) {
        socket.join(data.room);
        console.log(`Socket ${socket.id} joined room: ${data.room}`);
      }
    });

    // Room Support: Allow clients to leave rooms
    socket.on('leaveRoom', (data) => {
      if (data && data.room) {
        socket.leave(data.room);
        console.log(`Socket ${socket.id} left room: ${data.room}`);
      }
    });

    // Error Handling: Handle socket errors gracefully
    socket.on('error', (error) => {
      console.error(`Socket error on ID ${socket.id}:`, error.message || error);
    });

    // Register disconnect events
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: Socket ID = ${socket.id}. Reason: ${reason}`);
    });
  });
};

/* =========================================================================
   REUSABLE EMITTER HELPER FUNCTIONS
   ========================================================================= */

// Vehicle Events
export const emitVehicleCreated = (io, vehicle) => {
  if (io) io.emit('vehicleCreated', vehicle);
};

export const emitVehicleUpdated = (io, vehicle) => {
  if (io) io.emit('vehicleUpdated', vehicle);
};

export const emitVehicleDeleted = (io, vehicleId) => {
  if (io) io.emit('vehicleDeleted', vehicleId);
};

// Driver Events
export const emitDriverCreated = (io, driver) => {
  if (io) io.emit('driverCreated', driver);
};

export const emitDriverUpdated = (io, driver) => {
  if (io) io.emit('driverUpdated', driver);
};

// Trip Events
export const emitTripCreated = (io, trip) => {
  if (io) io.emit('tripCreated', trip);
};

export const emitTripStarted = (io, trip) => {
  if (io) io.emit('tripStarted', trip);
};

export const emitTripCompleted = (io, trip) => {
  if (io) io.emit('tripCompleted', trip);
};

export const emitTripCancelled = (io, trip) => {
  if (io) io.emit('tripCancelled', trip);
};

// Maintenance Events
export const emitMaintenanceCreated = (io, maintenance) => {
  if (io) io.emit('maintenanceCreated', maintenance);
};

export const emitMaintenanceUpdated = (io, maintenance) => {
  if (io) io.emit('maintenanceUpdated', maintenance);
};

export const emitMaintenanceCompleted = (io, maintenance) => {
  if (io) io.emit('maintenanceCompleted', maintenance);
};

// Fuel Events
export const emitFuelAdded = (io, fuelLog) => {
  if (io) io.emit('fuelAdded', fuelLog);
};

// Expense Events
export const emitExpenseAdded = (io, expense) => {
  if (io) io.emit('expenseAdded', expense);
};

// Dashboard Events
export const emitDashboardUpdated = (io, dashboardData) => {
  if (io) io.emit('dashboardUpdated', dashboardData);
};

// General Notification Event
export const emitNotification = (io, notification) => {
  if (io) io.emit('notification', notification);
};
