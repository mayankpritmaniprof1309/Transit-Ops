import app from './app.js';
import connectDB from './config/db.js';

// Load environmental variables if any
const PORT = process.env.PORT || 5000;

// Connect to Database first and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`TransitOps Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize application:', err.message);
  process.exit(1);
});
