// Server entry point - starts the server when run directly
import { createServer, PORT } from './server.js';
import prisma from './config/database.js';

createServer(PORT)
  .then(async () => {
    console.info(`Server is listening on port ${PORT}`);
    console.info(`API Documentation available at http://localhost:${PORT}/api-docs`);

    // Test database connection
    try {
      await prisma.$connect();
      console.info('Database connection successful');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
