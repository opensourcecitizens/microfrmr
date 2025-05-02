// server.js
// This file is the entry point for the Express server.
// It sets up the server, connects to the MongoDB database, and starts listening for incoming requests.
// File: src/server.js

import mongoose from 'mongoose';
import app from './src/app.js'; // Import the Express app
import { config } from './src/config/index.js'; // Import configuration

// Connect to MongoDB
mongoose.connect(config.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});