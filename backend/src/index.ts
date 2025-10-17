// Server entry point - starts the server when run directly
import { createServer, PORT } from './server.js';

createServer(PORT)
  .then(() => {
    console.info(`Server is listening on port ${PORT}`);
    console.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
