import { Server } from 'http';
import { app } from './app';

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const createServer = (port: number): Promise<Server> => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
};

// Start the server if this file is run directly
if (require.main === module) {
  createServer(PORT)
    .then(() => {
      console.info(`Server is listening on port ${PORT}`);
      console.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}
