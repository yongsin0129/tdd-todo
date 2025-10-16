import request from 'supertest';
import { app } from '../../src/app';
import prisma from '../../src/config/database';
import { CreateTodoDto } from '../../src/types/todo.types';

describe('PUT /api/todos/:id - Update Todo Integration Tests', () => {
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

  describe('Successful Todo Updates', () => {
    it('should update a todo successfully and return 200 status', async () => {
      // Arrange - Create a todo first
      const newTodo: CreateTodoDto = {
        title: 'Original title',
        description: 'Original description',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      const updateData = {
        title: 'Updated title',
      };

      // Act
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should support partial updates (PATCH semantics)', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Original title',
        description: 'Original description',
        priority: 'low',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - Only update title, keep other fields
      const updateData = {
        title: 'Only title updated',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Only title updated');
      expect(response.body.data.description).toBe('Original description');
      expect(response.body.data.priority).toBe('low');
    });

    it('should update the title field successfully', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Old title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'New title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('New title');
    });

    it('should update the description field successfully', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
        description: 'Old description',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        description: 'New description',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('New description');
    });

    it('should update the isCompleted status successfully', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        isCompleted: true,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.isCompleted).toBe(true);
    });

    it('should set completedAt when marking todo as completed', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const beforeUpdate = new Date();
      const updateData = {
        isCompleted: true,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      const afterUpdate = new Date();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.isCompleted).toBe(true);
      expect(response.body.data.completedAt).toBeDefined();
      expect(response.body.data.completedAt).not.toBeNull();

      const completedAt = new Date(response.body.data.completedAt);
      expect(completedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime() - 1000);
      expect(completedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime() + 1000);
    });

    it('should clear completedAt when marking todo as not completed', async () => {
      // Arrange - Create and complete a todo
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // First, complete the todo
      await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ isCompleted: true })
        .set('Content-Type', 'application/json');

      // Act - Mark as not completed
      const updateData = {
        isCompleted: false,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.isCompleted).toBe(false);
      expect(response.body.data.completedAt).toBeNull();
    });

    it('should automatically update the updatedAt timestamp', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;
      const originalUpdatedAt = createResponse.body.data.updatedAt;

      // Wait a bit to ensure time difference
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Act
      const beforeUpdate = new Date();
      const updateData = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      const afterUpdate = new Date();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.updatedAt).toBeDefined();
      expect(response.body.data.updatedAt).not.toBe(originalUpdatedAt);

      const newUpdatedAt = new Date(response.body.data.updatedAt);
      expect(newUpdatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime() - 1000);
      expect(newUpdatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime() + 1000);
    });

    it('should update priority field successfully', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
        priority: 'low',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        priority: 'high',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.priority).toBe('high');
    });

    it('should update dueDate field successfully', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const newDueDate = new Date('2025-12-31T23:59:59.999Z');
      const updateData = {
        dueDate: newDueDate,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.dueDate).toBeDefined();
      expect(new Date(response.body.data.dueDate).toISOString()).toBe(newDueDate.toISOString());
    });

    it('should update multiple fields at once', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Original title',
        description: 'Original description',
        priority: 'low',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
        description: 'Updated description',
        priority: 'high',
        isCompleted: true,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated title');
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.isCompleted).toBe(true);
    });

    it('should persist changes to the database', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Original title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
      };

      await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert - Check database
      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(dbTodo).toBeDefined();
      expect(dbTodo?.title).toBe('Updated title');
    });
  });

  describe('Error Handling - Non-existent Todo', () => {
    it('should return 404 when todo does not exist', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        title: 'Updated title',
      };

      // Act
      const response = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return descriptive error message when todo not found', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440001';
      const updateData = {
        title: 'Updated title',
      };

      // Act
      const response = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toMatch(/not found|does not exist/);
    });

    it('should not modify database when updating non-existent todo', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440002';
      const updateData = {
        title: 'Updated title',
      };
      const countBefore = await prisma.todo.count();

      // Act
      await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      const countAfter = await prisma.todo.count();
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('Error Handling - Invalid UUID Format', () => {
    it('should return 400 when ID is not a valid UUID', async () => {
      // Arrange
      const invalidId = 'not-a-valid-uuid';
      const updateData = {
        title: 'Updated title',
      };

      // Act
      const response = await request(app)
        .put(`/api/todos/${invalidId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return descriptive error message for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';
      const updateData = {
        title: 'Updated title',
      };

      // Act
      const response = await request(app)
        .put(`/api/todos/${invalidId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toMatch(/invalid|uuid|id/);
    });
  });

  describe('Error Handling - Invalid Data Format', () => {
    it('should return 400 when title is empty string', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: '',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toContain('title');
    });

    it('should return 400 when title contains only whitespace', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: '   ',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when title exceeds 255 characters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'a'.repeat(256),
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid priority value', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        priority: 'urgent',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toMatch(/priority/);
    });

    it('should return 400 for invalid dueDate format', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        dueDate: 'not-a-date',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid isCompleted type', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        isCompleted: 'yes',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when request body is empty', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({})
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle malformed JSON request body', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Valid title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send('{ invalid json }')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Read-only Fields Protection', () => {
    it('should not allow updating the id field', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const originalId = createResponse.body.data.id;

      // Act
      const updateData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${originalId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(originalId);
      expect(response.body.data.id).not.toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should not allow updating the createdAt field', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;
      const originalCreatedAt = createResponse.body.data.createdAt;

      // Act
      const customDate = new Date('2020-01-01T00:00:00.000Z');
      const updateData = {
        createdAt: customDate,
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.createdAt).toBe(originalCreatedAt);
      expect(response.body.data.createdAt).not.toBe(customDate.toISOString());
    });

    it('should not allow manually setting updatedAt field', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const customDate = new Date('2020-01-01T00:00:00.000Z');
      const updateData = {
        updatedAt: customDate,
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.updatedAt).not.toBe(customDate.toISOString());
      // updatedAt should be set to current time automatically
      const updatedAt = new Date(response.body.data.updatedAt);
      const now = new Date();
      expect(updatedAt.getTime()).toBeGreaterThan(customDate.getTime());
      expect(updatedAt.getTime()).toBeLessThanOrEqual(now.getTime() + 1000);
    });

    it('should ignore extra unexpected fields in update request', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
        unexpectedField: 'should be ignored',
        anotherField: 123,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated title');
      expect(response.body.data).not.toHaveProperty('unexpectedField');
      expect(response.body.data).not.toHaveProperty('anotherField');
    });
  });

  describe('Edge Cases', () => {
    it('should trim leading and trailing whitespace from title', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: '  Updated title with spaces  ',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated title with spaces');
    });

    it('should handle updating with special characters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Special chars: @#$%^&*()_+-=[]{}|;:\'",.<>?/~`',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toContain('@#$%');
    });

    it('should handle updating with unicode characters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Unicode: 你好世界 🌍 café',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Unicode: 你好世界 🌍 café');
    });

    it('should allow setting description to null', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
        description: 'Original description',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        description: null,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBeNull();
    });

    it('should allow setting dueDate to null', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
        dueDate: new Date('2025-12-31T23:59:59.999Z'),
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        dueDate: null,
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.dueDate).toBeNull();
    });

    it('should handle multiple consecutive updates', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Original title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - First update
      const firstUpdate = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'First update' })
        .set('Content-Type', 'application/json');

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Act - Second update
      const secondUpdate = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Second update' })
        .set('Content-Type', 'application/json');

      // Assert
      expect(firstUpdate.status).toBe(200);
      expect(secondUpdate.status).toBe(200);
      expect(secondUpdate.body.data.title).toBe('Second update');
      expect(new Date(secondUpdate.body.data.updatedAt).getTime()).toBeGreaterThan(
        new Date(firstUpdate.body.data.updatedAt).getTime()
      );
    });

    it('should handle UUID with uppercase letters', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id.toUpperCase();

      // Act
      const updateData = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('Response Format Validation', () => {
    it('should return response with success flag set to true on successful update', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return response with data property containing updated todo', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('data');
      expect(typeof response.body.data).toBe('object');
      expect(response.body.data).not.toBeNull();
    });

    it('should return JSON content type', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should not include extra unexpected fields in successful response', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      const responseKeys = Object.keys(response.body);
      expect(responseKeys).toEqual(expect.arrayContaining(['success', 'data']));
      expect(responseKeys.length).toBe(2);
    });

    it('should return error response with success false on failure', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        title: 'Updated title',
      };

      // Act
      const response = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
    });
  });

  describe('Database Consistency', () => {
    it('should not modify database when update validation fails', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Original title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: '',
      };

      await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert - Check database still has original data
      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(dbTodo).toBeDefined();
      expect(dbTodo?.title).toBe('Original title');
    });

    it('should ensure database consistency after successful update', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Original title',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const updateData = {
        title: 'Updated title',
        description: 'New description',
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .set('Content-Type', 'application/json');

      // Assert - Verify database matches response
      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(dbTodo).toBeDefined();
      expect(dbTodo?.title).toBe(response.body.data.title);
      expect(dbTodo?.description).toBe(response.body.data.description);
      expect(dbTodo?.updatedAt.toISOString()).toBe(response.body.data.updatedAt);
    });
  });
});
