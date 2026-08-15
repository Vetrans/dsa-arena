import * as dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';

// 1. Load dotenv
dotenv.config();

// 2. Import app
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// 3. Connect to MongoDB
connectDB().then(() => {
  // 4. Start listening on PORT
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // 5. Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
});
