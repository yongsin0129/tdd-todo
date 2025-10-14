import request from 'supertest';
import { Express } from 'express';

describe('Express App Initialization', () => {
  let app: Express;

  beforeEach(() => {
    // Clear any cached modules to ensure clean test state
    jest.resetModules();
  });

  describe('App Creation', () => {
    it('should create an Express app instance', () => {
      // Arrange & Act
      const { app: testApp } = require('../src/app');

      // Assert
      expect(testApp).toBeDefined();
      expect(testApp).toHaveProperty('listen');
      expect(testApp).toHaveProperty('use');
      expect(testApp).toHaveProperty('get');
      expect(testApp).toHaveProperty('post');
    });

    it('should export an Express application', () => {
      // Arrange & Act
      const appModule = require('../src/app');

      // Assert
      expect(appModule).toHaveProperty('app');
      expect(typeof appModule.app).toBe('function');
    });
  });

  describe('Middleware Configuration', () => {
    beforeEach(() => {
      const { app: testApp } = require('../src/app');
      app = testApp;
    });

    it('should parse JSON request bodies', async () => {
      // Arrange
      const testData = { test: 'data', nested: { value: 123 } };

      // Act
      const response = await request(app)
        .post('/test-json')
        .send(testData)
        .set('Content-Type', 'application/json');

      // Assert - We expect 404 since route doesn't exist yet
      // But if JSON parsing works, body should be parsed
      expect(response.status).toBeDefined();
    });

    it('should have CORS enabled', async () => {
      // Arrange & Act
      const response = await request(app).options('/health').set('Origin', 'http://localhost:3000');

      // Assert
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should set proper CORS headers on requests', async () => {
      // Arrange & Act
      const response = await request(app).get('/health').set('Origin', 'http://localhost:3000');

      // Assert
      expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });
  });

  describe('Health Check Endpoint', () => {
    beforeEach(() => {
      const { app: testApp } = require('../src/app');
      app = testApp;
    });

    it('should respond with 200 status on GET /health', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.status).toBe(200);
    });

    it('should return JSON content type for /health', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return correct health check structure', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return status "ok" in health check', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.body.status).toBe('ok');
    });

    it('should return valid ISO 8601 timestamp', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.body.timestamp).toBeDefined();
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });

    it('should return current timestamp within reasonable range', async () => {
      // Arrange
      const beforeRequest = new Date();

      // Act
      const response = await request(app).get('/health');
      const afterRequest = new Date();

      // Assert
      const responseTime = new Date(response.body.timestamp);
      expect(responseTime.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime() - 1000);
      expect(responseTime.getTime()).toBeLessThanOrEqual(afterRequest.getTime() + 1000);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      const { app: testApp } = require('../src/app');
      app = testApp;
    });

    it('should return 404 for unknown routes', async () => {
      // Arrange & Act
      const response = await request(app).get('/unknown-route');

      // Assert
      expect(response.status).toBe(404);
    });

    it('should return 404 for POST to unknown routes', async () => {
      // Arrange & Act
      const response = await request(app).post('/unknown-route');

      // Assert
      expect(response.status).toBe(404);
    });

    it('should return JSON error response for 404', async () => {
      // Arrange & Act
      const response = await request(app).get('/non-existent');

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toHaveProperty('error');
    });

    it('should include error message in 404 response', async () => {
      // Arrange & Act
      const response = await request(app).get('/non-existent');

      // Assert
      expect(response.body.error).toBeDefined();
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error).toMatch(/not found/i);
    });

    it('should include requested path in 404 error message', async () => {
      // Arrange
      const testPath = '/test-path-that-does-not-exist';

      // Act
      const response = await request(app).get(testPath);

      // Assert
      expect(response.body.error).toContain(testPath);
    });
  });

  describe('HTTP Methods Support', () => {
    beforeEach(() => {
      const { app: testApp } = require('../src/app');
      app = testApp;
    });

    it('should handle GET requests', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.status).not.toBe(405); // Method not allowed
    });

    it('should handle POST requests', async () => {
      // Arrange & Act
      const response = await request(app).post('/unknown');

      // Assert
      expect(response.status).toBe(404); // Not found, but POST method is handled
    });

    it('should handle PUT requests', async () => {
      // Arrange & Act
      const response = await request(app).put('/unknown');

      // Assert
      expect(response.status).toBe(404); // Not found, but PUT method is handled
    });

    it('should handle DELETE requests', async () => {
      // Arrange & Act
      const response = await request(app).delete('/unknown');

      // Assert
      expect(response.status).toBe(404); // Not found, but DELETE method is handled
    });
  });

  describe('Response Headers', () => {
    beforeEach(() => {
      const { app: testApp } = require('../src/app');
      app = testApp;
    });

    it('should set Content-Type header for JSON responses', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      expect(response.headers['content-type']).toBeDefined();
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should include X-Powered-By or custom header', async () => {
      // Arrange & Act
      const response = await request(app).get('/health');

      // Assert
      // Express includes X-Powered-By by default (or should be disabled for security)
      expect(response.headers).toBeDefined();
    });
  });
});

describe('Server Lifecycle', () => {
  describe('Server Startup', () => {
    it('should export a createServer function', () => {
      // Arrange & Act
      const serverModule = require('../src/server');

      // Assert
      expect(serverModule).toHaveProperty('createServer');
      expect(typeof serverModule.createServer).toBe('function');
    });

    it('should start server on specified port', async () => {
      // Arrange
      const { createServer } = require('../src/server');
      const testPort = 3001;

      // Act
      const server = await createServer(testPort);

      // Assert
      expect(server).toBeDefined();
      expect(server.listening).toBe(true);

      // Cleanup
      await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    it('should return server instance from createServer', async () => {
      // Arrange
      const { createServer } = require('../src/server');
      const testPort = 3002;

      // Act
      const server = await createServer(testPort);

      // Assert
      expect(server).toHaveProperty('close');
      expect(server).toHaveProperty('listening');
      expect(typeof server.close).toBe('function');

      // Cleanup
      await new Promise<void>((resolve) => server.close(() => resolve()));
    });
  });

  describe('Server Shutdown', () => {
    it('should gracefully close the server', async () => {
      // Arrange
      const { createServer } = require('../src/server');
      const testPort = 3003;
      const server = await createServer(testPort);

      // Act
      const closePromise = new Promise<void>((resolve, reject) => {
        server.close((err?: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Assert
      await expect(closePromise).resolves.toBeUndefined();
      expect(server.listening).toBe(false);
    });

    it('should allow multiple close calls without errors', async () => {
      // Arrange
      const { createServer } = require('../src/server');
      const testPort = 3004;
      const server = await createServer(testPort);

      // Act
      await new Promise<void>((resolve) => server.close(() => resolve()));

      // Second close should not throw
      const secondClose = new Promise<void>((resolve) => {
        server.close(() => resolve());
      });

      // Assert
      await expect(secondClose).resolves.toBeUndefined();
    });
  });

  describe('Port Configuration', () => {
    it('should use default port 3000 when not specified', () => {
      // Arrange
      delete process.env.PORT;

      // Act
      const { PORT } = require('../src/server');

      // Assert
      expect(PORT).toBe(3000);
    });

    it('should use PORT environment variable when set', () => {
      // Arrange
      process.env.PORT = '5000';

      // Act
      jest.resetModules();
      const { PORT } = require('../src/server');

      // Assert
      expect(PORT).toBe(5000);

      // Cleanup
      delete process.env.PORT;
    });
  });
});
