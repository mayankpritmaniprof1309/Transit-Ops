import { registerSocketEvents } from '../socket/socketEvents.js';

/**
 * Configure and register Socket.IO server events
 * @param {Object} io - The Socket.IO server instance
 */
const setupSocket = (io) => {
  if (!io) {
    return;
  }
  registerSocketEvents(io);
};

export default setupSocket;
