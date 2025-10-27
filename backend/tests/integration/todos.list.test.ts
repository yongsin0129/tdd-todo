import request from 'supertest';
import { app } from '../../src/app.js';
import prisma from '../../src/config/database.js';
import { Todo } from '../../src/types/todo.types.js';

describe('GET /api/todos - List All Todos Integration Tests', () => {
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

  describe('Basic Listing Functionality', () => {
    it('should return 200 status when listing todos', async () => {
      // Arrange - No setup needed for empty list

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
    });

    it('should return empty array when no todos exist', async () => {
      // Arrange - Database is empty from beforeEach

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return JSON content type', async () => {
      // Arrange - No setup needed

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return array of todos when todos exist', async () => {
      // Arrange - Create test data
      await prisma.todo.create({
        data: {
          title: 'First todo',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return multiple todos when multiple exist', async () => {
      // Arrange - Create multiple test todos
      await prisma.todo.createMany({
        data: [
          { title: 'First todo', isCompleted: false, priority: 'HIGH' },
          { title: 'Second todo', isCompleted: true, priority: 'LOW' },
          { title: 'Third todo', isCompleted: false, priority: 'NORMAL' },
        ],
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
    });
  });

  describe('Todo Data Format Validation', () => {
    it('should return todos with all required fields', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'Complete todo',
          description: 'Test description',
          isCompleted: false,
          priority: 'HIGH',
          dueDate: new Date('2025-12-31'),
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const todo = response.body.data[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('description');
      expect(todo).toHaveProperty('isCompleted');
      expect(todo).toHaveProperty('createdAt');
      expect(todo).toHaveProperty('updatedAt');
      expect(todo).toHaveProperty('priority');
      expect(todo).toHaveProperty('dueDate');
    });

    it('should return valid UUID for id field', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'UUID test',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const todo = response.body.data[0];
      expect(todo.id).toBeDefined();
      expect(typeof todo.id).toBe('string');
      expect(todo.id).toMatch(uuidRegex);
    });

    it('should return valid ISO 8601 formatted timestamps', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'Timestamp test',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const todo = response.body.data[0];
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
      const createdAt = new Date(todo.createdAt);
      const updatedAt = new Date(todo.updatedAt);
      expect(createdAt.toISOString()).toBe(todo.createdAt);
      expect(updatedAt.toISOString()).toBe(todo.updatedAt);
    });

    it('should return correct data types for all fields', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'Type test',
          description: 'Test description',
          isCompleted: true,
          priority: 'HIGH',
          dueDate: new Date('2025-12-31'),
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const todo = response.body.data[0];
      expect(typeof todo.id).toBe('string');
      expect(typeof todo.title).toBe('string');
      expect(typeof todo.isCompleted).toBe('boolean');
      expect(typeof todo.createdAt).toBe('string');
      expect(typeof todo.updatedAt).toBe('string');
      expect(typeof todo.priority).toBe('string');
    });

    it('should return null for optional fields when not set', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'Minimal todo',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const todo = response.body.data[0];
      expect(todo.description).toBeNull();
      expect(todo.dueDate).toBeNull();
      expect(todo.completedAt).toBeNull();
    });

    it('should return actual values for optional fields when set', async () => {
      // Arrange
      const dueDate = new Date('2025-12-31T23:59:59.999Z');
      await prisma.todo.create({
        data: {
          title: 'Complete todo',
          description: 'Full description',
          isCompleted: false,
          priority: 'HIGH',
          dueDate: dueDate,
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const todo = response.body.data[0];
      expect(todo.description).toBe('Full description');
      expect(new Date(todo.dueDate).toISOString()).toBe(dueDate.toISOString());
    });
  });

  describe('Sorting and Ordering', () => {
    it('should return todos sorted by createdAt in descending order (newest first)', async () => {
      // Arrange - Create todos with specific timestamps
      const firstTodo = await prisma.todo.create({
        data: {
          title: 'First todo (oldest)',
          isCompleted: false,
          priority: 'NORMAL',
          createdAt: new Date('2025-01-01T10:00:00.000Z'),
        },
      });

      const secondTodo = await prisma.todo.create({
        data: {
          title: 'Second todo (middle)',
          isCompleted: false,
          priority: 'NORMAL',
          createdAt: new Date('2025-01-02T10:00:00.000Z'),
        },
      });

      const thirdTodo = await prisma.todo.create({
        data: {
          title: 'Third todo (newest)',
          isCompleted: false,
          priority: 'NORMAL',
          createdAt: new Date('2025-01-03T10:00:00.000Z'),
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert - Newest should be first
      expect(response.body.data[0].id).toBe(thirdTodo.id);
      expect(response.body.data[1].id).toBe(secondTodo.id);
      expect(response.body.data[2].id).toBe(firstTodo.id);
    });

    it('should maintain descending order with multiple todos', async () => {
      // Arrange - Create multiple todos
      const todos = [];
      for (let i = 0; i < 5; i++) {
        const todo = await prisma.todo.create({
          data: {
            title: `Todo ${i}`,
            isCompleted: false,
            priority: 'NORMAL',
            createdAt: new Date(Date.now() + i * 1000),
          },
        });
        todos.push(todo);
      }

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert - Should be in reverse order (newest first)
      const createdAtDates = response.body.data.map((todo: Todo) =>
        new Date(todo.createdAt).getTime()
      );
      for (let i = 0; i < createdAtDates.length - 1; i++) {
        expect(createdAtDates[i]).toBeGreaterThanOrEqual(createdAtDates[i + 1]);
      }
    });
  });

  describe('Filtering by Completion Status', () => {
    beforeEach(async () => {
      // Create a mix of completed and incomplete todos
      await prisma.todo.createMany({
        data: [
          { title: 'Completed todo 1', isCompleted: true, priority: 'HIGH' },
          { title: 'Incomplete todo 1', isCompleted: false, priority: 'NORMAL' },
          { title: 'Completed todo 2', isCompleted: true, priority: 'LOW' },
          { title: 'Incomplete todo 2', isCompleted: false, priority: 'HIGH' },
          { title: 'Incomplete todo 3', isCompleted: false, priority: 'NORMAL' },
        ],
      });
    });

    it('should return all todos when no filter is applied', async () => {
      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
    });

    it('should return only completed todos when isCompleted=true', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=true')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((todo: Todo) => {
        expect(todo.isCompleted).toBe(true);
      });
    });

    it('should return only incomplete todos when isCompleted=false', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=false')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      response.body.data.forEach((todo: Todo) => {
        expect(todo.isCompleted).toBe(false);
      });
    });

    it('should handle case-insensitive isCompleted filter', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=TRUE')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((todo: Todo) => {
        expect(todo.isCompleted).toBe(true);
      });
    });

    it('should return empty array when no todos match filter', async () => {
      // Arrange - Delete all completed todos
      await prisma.todo.deleteMany({
        where: { isCompleted: true },
      });

      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=true')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('Pagination Support', () => {
    beforeEach(async () => {
      // Create 25 todos for pagination testing
      const todos = Array.from({ length: 25 }, (_, i) => ({
        title: `Todo ${i + 1}`,
        isCompleted: i % 2 === 0,
        priority: 'NORMAL' as const,
        createdAt: new Date(Date.now() + i * 1000),
      }));
      await prisma.todo.createMany({ data: todos });
    });

    it('should return first page with default limit of 10', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=1')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(10);
    });

    it('should return second page of results', async () => {
      // Act
      const firstPage = await request(app)
        .get('/api/todos?page=1&limit=10')
        .set('Content-Type', 'application/json');

      const secondPage = await request(app)
        .get('/api/todos?page=2&limit=10')
        .set('Content-Type', 'application/json');

      // Assert
      expect(firstPage.body.data).toHaveLength(10);
      expect(secondPage.body.data).toHaveLength(10);
      expect(firstPage.body.data[0].id).not.toBe(secondPage.body.data[0].id);
    });

    it('should respect custom limit parameter', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?limit=5')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
    });

    it('should return remaining items on last page', async () => {
      // Act - Page 3 with limit 10 should have 5 items (25 total)
      const response = await request(app)
        .get('/api/todos?page=3&limit=10')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
    });

    it('should return empty array for page beyond available data', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=10&limit=10')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });

    it('should include pagination metadata in response', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=1&limit=10')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('totalPages');
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBe(25);
      expect(response.body.pagination.totalPages).toBe(3);
    });

    it('should handle pagination with filtering combined', async () => {
      // Act - Get only completed todos with pagination
      const response = await request(app)
        .get('/api/todos?isCompleted=true&page=1&limit=5')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      response.body.data.forEach((todo: Todo) => {
        expect(todo.isCompleted).toBe(true);
      });
    });

    it('should default to page 1 when page is not specified', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?limit=10')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(10);
    });

    it('should default to limit 10 when limit is not specified', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=1')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(10);
    });
  });

  describe('Query Parameter Validation', () => {
    it('should return 400 for invalid isCompleted value', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=invalid')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message.toLowerCase()).toMatch(/iscompleted|boolean/);
    });

    it('should return 400 for negative page number', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=-1')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.message.toLowerCase()).toMatch(/page/);
    });

    it('should return 400 for zero page number', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=0')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for negative limit', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?limit=-5')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.message.toLowerCase()).toMatch(/limit/);
    });

    it('should return 400 for zero limit', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?limit=0')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for limit exceeding maximum (100)', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?limit=101')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.message.toLowerCase()).toMatch(/limit|maximum/);
    });

    it('should return 400 for non-numeric page value', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?page=abc')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for non-numeric limit value', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?limit=xyz')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should ignore unknown query parameters gracefully', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?unknownParam=value&anotherParam=123')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle multiple valid query parameters together', async () => {
      // Arrange
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', isCompleted: true, priority: 'HIGH' },
          { title: 'Todo 2', isCompleted: true, priority: 'NORMAL' },
        ],
      });

      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=true&page=1&limit=10')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((todo: Todo) => {
        expect(todo.isCompleted).toBe(true);
      });
    });
  });

  describe('Response Format Validation', () => {
    it('should return response with success flag set to true', async () => {
      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
    });

    it('should return response with data property containing array', async () => {
      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should not include extra unexpected fields in success response', async () => {
      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const responseKeys = Object.keys(response.body);
      expect(responseKeys).toContain('success');
      expect(responseKeys).toContain('data');
    });

    it('should return error response with success false on validation failure', async () => {
      // Act
      const response = await request(app)
        .get('/api/todos?isCompleted=invalid')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
    });
  });

  describe('Edge Cases and Performance', () => {
    it('should handle large dataset efficiently', async () => {
      // Arrange - Create 100 todos
      const todos = Array.from({ length: 100 }, (_, i) => ({
        title: `Todo ${i + 1}`,
        isCompleted: i % 2 === 0,
        priority: 'NORMAL' as const,
      }));
      await prisma.todo.createMany({ data: todos });
      const startTime = Date.now();

      // Act
      const response = await request(app)
        .get('/api/todos?limit=50')
        .set('Content-Type', 'application/json');

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(50);
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle todos with special characters in fields', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'Todo with special chars: @#$%^&*()_+-=[]{}|;:\'",.<>?/~`',
          description: 'Description with unicode: 你好世界 🌍 café',
          isCompleted: false,
          priority: 'HIGH',
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data[0].title).toContain('@#$%');
      expect(response.body.data[0].description).toContain('你好世界');
    });

    it('should handle todos with very long descriptions', async () => {
      // Arrange
      const longDescription = 'a'.repeat(5000);
      await prisma.todo.create({
        data: {
          title: 'Long description todo',
          description: longDescription,
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data[0].description).toBe(longDescription);
    });

    it('should handle todos created at exact same timestamp', async () => {
      // Arrange
      const sameTimestamp = new Date('2025-01-01T12:00:00.000Z');
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', isCompleted: false, priority: 'HIGH', createdAt: sameTimestamp },
          { title: 'Todo 2', isCompleted: false, priority: 'NORMAL', createdAt: sameTimestamp },
          { title: 'Todo 3', isCompleted: false, priority: 'LOW', createdAt: sameTimestamp },
        ],
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
    });

    it('should return consistent results for repeated requests', async () => {
      // Arrange
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', isCompleted: false, priority: 'HIGH' },
          { title: 'Todo 2', isCompleted: true, priority: 'NORMAL' },
        ],
      });

      // Act
      const firstResponse = await request(app)
        .get('/api/todos')
        .set('Content-Type', 'application/json');

      const secondResponse = await request(app)
        .get('/api/todos')
        .set('Content-Type', 'application/json');

      // Assert
      expect(firstResponse.body.data).toEqual(secondResponse.body.data);
    });

    it('should handle request without Content-Type header', async () => {
      // Arrange
      await prisma.todo.create({
        data: {
          title: 'Test todo',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Act
      const response = await request(app).get('/api/todos');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('Database Consistency', () => {
    it('should return todos that match database state', async () => {
      // Arrange
      const createdTodo = await prisma.todo.create({
        data: {
          title: 'Database consistency test',
          description: 'Test description',
          isCompleted: false,
          priority: 'HIGH',
        },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      const returnedTodo = response.body.data[0];
      expect(returnedTodo.id).toBe(createdTodo.id);
      expect(returnedTodo.title).toBe(createdTodo.title);
      expect(returnedTodo.description).toBe(createdTodo.description);
      expect(returnedTodo.priority).toBe(createdTodo.priority);
    });

    it('should reflect updated todos from database', async () => {
      // Arrange
      const todo = await prisma.todo.create({
        data: {
          title: 'Original title',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Update the todo
      await prisma.todo.update({
        where: { id: todo.id },
        data: { title: 'Updated title', isCompleted: true },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.body.data[0].title).toBe('Updated title');
      expect(response.body.data[0].isCompleted).toBe(true);
    });

    it('should not include deleted todos', async () => {
      // Arrange
      const todo = await prisma.todo.create({
        data: {
          title: 'To be deleted',
          isCompleted: false,
          priority: 'NORMAL',
        },
      });

      // Delete the todo
      await prisma.todo.delete({
        where: { id: todo.id },
      });

      // Act
      const response = await request(app).get('/api/todos').set('Content-Type', 'application/json');

      // Assert
      expect(response.body.data).toHaveLength(0);
    });
  });
});
