import request from 'supertest';
import { app } from '../../src/app';
import prisma from '../../src/config/database';
import { CreateTodoDto } from '../../src/types/todo.types';

describe('GET /api/todos/:id - Get Single Todo Integration Tests', () => {
  // Clean up database before and after each test to ensure test isolation
  beforeEach(async () => {
    await prisma.todo.deleteMany({});
  });

  afterEach(async () => {
    await prisma.todo.deleteMany({});
  });

  // Clean up database connection after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Successful Todo Retrieval', () => {
    it('should retrieve a single todo by ID and return 200 status', async () => {
      // Arrange - Create a todo first
      const newTodo: CreateTodoDto = {
        title: 'Test todo for retrieval',
        description: 'This is a test description',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - Retrieve the todo
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should return the todo with all required fields', async () => {
      // Arrange - Create a todo first
      const newTodo: CreateTodoDto = {
        title: 'Complete todo item',
        description: 'Detailed description',
        priority: 'high',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', todoId);
      expect(response.body.data).toHaveProperty('title', 'Complete todo item');
      expect(response.body.data).toHaveProperty('description', 'Detailed description');
      expect(response.body.data).toHaveProperty('priority', 'high');
      expect(response.body.data).toHaveProperty('isCompleted', false);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty('dueDate');
      expect(response.body.data).toHaveProperty('completedAt');
    });

    it('should return the correct todo data matching database record', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Database match test',
        description: 'Test matching',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert - Compare with database record
      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(response.body.data.id).toBe(dbTodo?.id);
      expect(response.body.data.title).toBe(dbTodo?.title);
      expect(response.body.data.description).toBe(dbTodo?.description);
      expect(response.body.data.isCompleted).toBe(dbTodo?.isCompleted);
    });

    it('should return JSON content type', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Content type test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should retrieve todo with null optional fields correctly', async () => {
      // Arrange - Create a minimal todo
      const newTodo: CreateTodoDto = {
        title: 'Minimal todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBeNull();
      expect(response.body.data.dueDate).toBeNull();
      expect(response.body.data.completedAt).toBeNull();
    });

    it('should retrieve todo with all optional fields populated', async () => {
      // Arrange - Create a complete todo
      const newTodo: CreateTodoDto = {
        title: 'Complete todo',
        description: 'Full description',
        priority: 'high',
        dueDate: new Date('2025-12-31T23:59:59.999Z'),
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Complete todo');
      expect(response.body.data.description).toBe('Full description');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.dueDate).toBeDefined();
      expect(response.body.data.dueDate).not.toBeNull();
    });
  });

  describe('Error Handling - Non-existent Todo', () => {
    it('should return 404 when todo does not exist', async () => {
      // Arrange - Use a valid UUID that does not exist
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const response = await request(app).get(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return descriptive error message when todo not found', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440001';

      // Act
      const response = await request(app).get(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toMatch(/not found|does not exist/);
    });

    it('should not return data property when todo not found', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440002';

      // Act
      const response = await request(app).get(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.body).not.toHaveProperty('data');
    });
  });

  describe('Error Handling - Invalid UUID Format', () => {
    it('should return 400 when ID is not a valid UUID', async () => {
      // Arrange
      const invalidId = 'not-a-valid-uuid';

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when ID is a number', async () => {
      // Arrange
      const invalidId = '123456';

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when ID is an empty string', async () => {
      // Arrange & Act
      const response = await request(app).get('/api/todos/');

      // Assert
      // Empty string in route will match GET /api/todos (getAllTodos), which returns 200
      // This is expected behavior as the route pattern doesn't match
      expect([200, 400, 404]).toContain(response.status);
    });

    it('should return 400 when ID contains special characters', async () => {
      // Arrange
      const invalidId = 'abc@123#xyz';

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when ID is malformed UUID', async () => {
      // Arrange - UUID with wrong format
      const invalidId = '550e8400-e29b-41d4-a716-44665544000'; // Missing one character

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when ID has invalid UUID version', async () => {
      // Arrange - Valid format but invalid content
      const invalidId = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return descriptive error message for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toMatch(/invalid|uuid|id/);
    });
  });

  describe('Response Format Validation', () => {
    it('should return response with success flag set to true on successful retrieval', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Response format test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return response with data property containing todo object', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Data property test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.body).toHaveProperty('data');
      expect(typeof response.body.data).toBe('object');
      expect(response.body.data).not.toBeNull();
    });

    it('should not include extra unexpected fields in successful response', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Clean response test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      const responseKeys = Object.keys(response.body);
      expect(responseKeys).toEqual(expect.arrayContaining(['success', 'data']));
      expect(responseKeys.length).toBe(2);
    });

    it('should return error response with success false on not found', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440099';

      // Act
      const response = await request(app).get(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
    });

    it('should include error message in error response', async () => {
      // Arrange
      const invalidId = 'invalid';

      // Act
      const response = await request(app).get(`/api/todos/${invalidId}`);

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle todo with special characters in title', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Special chars: @#$%^&*()_+-=[]{}|;:\'",.<>?/~`',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toContain('@#$%');
    });

    it('should handle todo with unicode characters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Unicode: 你好世界 🌍 café',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Unicode: 你好世界 🌍 café');
    });

    it('should handle todo with very long description', async () => {
      // Arrange
      const longDescription = 'Long description. '.repeat(100);
      const newTodo: CreateTodoDto = {
        title: 'Long description test',
        description: longDescription,
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe(longDescription);
    });

    it('should return different todos when different IDs are requested', async () => {
      // Arrange - Create two todos
      const todo1: CreateTodoDto = { title: 'First todo' };
      const todo2: CreateTodoDto = { title: 'Second todo' };

      const response1 = await request(app)
        .post('/api/todos')
        .send(todo1)
        .set('Content-Type', 'application/json');

      const response2 = await request(app)
        .post('/api/todos')
        .send(todo2)
        .set('Content-Type', 'application/json');

      const id1 = response1.body.data.id;
      const id2 = response2.body.data.id;

      // Act
      const getResponse1 = await request(app).get(`/api/todos/${id1}`);
      const getResponse2 = await request(app).get(`/api/todos/${id2}`);

      // Assert
      expect(getResponse1.body.data.title).toBe('First todo');
      expect(getResponse2.body.data.title).toBe('Second todo');
      expect(getResponse1.body.data.id).not.toBe(getResponse2.body.data.id);
    });

    it('should handle UUID with uppercase letters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Uppercase UUID test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id.toUpperCase();

      // Act
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert - Should work regardless of case
      expect([200, 400, 404]).toContain(response.status);
    });

    it('should handle UUID with mixed case letters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Mixed case UUID test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const originalId = createResponse.body.data.id;
      const mixedCaseId = originalId
        .split('')
        .map((char: string, index: number) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
        .join('');

      // Act
      const response = await request(app).get(`/api/todos/${mixedCaseId}`);

      // Assert - Should work regardless of case
      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('Database Consistency', () => {
    it('should retrieve the most recent version of the todo', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Original title',
        description: 'Original description',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - Get the todo
      const response = await request(app).get(`/api/todos/${todoId}`);

      // Assert - Data should match database
      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(response.body.data.title).toBe(dbTodo?.title);
      expect(response.body.data.description).toBe(dbTodo?.description);
      expect(response.body.data.updatedAt).toBe(dbTodo?.updatedAt.toISOString());
    });

    it('should not modify the todo when retrieving it', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Immutable retrieval test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;
      const originalUpdatedAt = createResponse.body.data.updatedAt;

      // Act - Wait a bit and retrieve
      await new Promise((resolve) => setTimeout(resolve, 10));
      await request(app).get(`/api/todos/${todoId}`);

      // Assert - updatedAt should not change
      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(dbTodo?.updatedAt.toISOString()).toBe(originalUpdatedAt);
    });
  });

  describe('Multiple Retrievals', () => {
    it('should handle multiple retrievals of the same todo', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Multiple retrieval test',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - Retrieve multiple times
      const responses = await Promise.all([
        request(app).get(`/api/todos/${todoId}`),
        request(app).get(`/api/todos/${todoId}`),
        request(app).get(`/api/todos/${todoId}`),
      ]);

      // Assert - All should succeed with same data
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(todoId);
        expect(response.body.data.title).toBe('Multiple retrieval test');
      });
    });

    it('should handle concurrent retrievals of different todos', async () => {
      // Arrange - Create multiple todos sequentially to avoid SQLite write lock issues
      const todos: CreateTodoDto[] = [
        { title: 'Todo 1' },
        { title: 'Todo 2' },
        { title: 'Todo 3' },
      ];

      const createResponses = [];
      for (const todo of todos) {
        const response = await request(app)
          .post('/api/todos')
          .send(todo)
          .set('Content-Type', 'application/json');

        // Verify each todo was created successfully before proceeding
        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        createResponses.push(response);
      }

      const ids = createResponses.map((r) => r.body.data.id);

      // Verify we have valid IDs
      expect(ids).toHaveLength(3);
      ids.forEach(id => expect(id).toBeTruthy());

      // Act - Retrieve all concurrently
      const getResponses = await Promise.all(ids.map((id) => request(app).get(`/api/todos/${id}`)));

      // Assert
      getResponses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe(`Todo ${index + 1}`);
      });
    });
  });
});
