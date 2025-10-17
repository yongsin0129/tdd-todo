import { Server } from 'http';
import { app } from './app.js';

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const createServer = (port: number): Promise<Server> => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
};
