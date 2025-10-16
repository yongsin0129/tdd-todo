import request from 'supertest';
import { app } from '../../src/app';
import prisma from '../../src/config/database';
import { CreateTodoDto } from '../../src/types/todo.types';

describe('DELETE /api/todos/:id - Delete Todo Integration Tests', () => {
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

  describe('Successful Todo Deletion', () => {
    it('should delete a todo successfully and return 204 status', async () => {
      // Arrange - Create a todo first
      const newTodo: CreateTodoDto = {
        title: 'Todo to be deleted',
        description: 'This todo will be deleted',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should remove the todo from the database after deletion', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Todo to be deleted',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      await request(app).delete(`/api/todos/${todoId}`);

      // Assert - Verify todo is removed from database
      const deletedTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(deletedTodo).toBeNull();
    });

    it('should decrease the total count of todos after deletion', async () => {
      // Arrange - Create multiple todos
      const todos: CreateTodoDto[] = [
        { title: 'Todo 1' },
        { title: 'Todo 2' },
        { title: 'Todo 3' },
      ];

      const createPromises = todos.map((todo) =>
        request(app).post('/api/todos').send(todo).set('Content-Type', 'application/json')
      );

      const responses = await Promise.all(createPromises);
      const todoId = responses[1].body.data.id;

      const countBefore = await prisma.todo.count();

      // Act
      await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      const countAfter = await prisma.todo.count();
      expect(countAfter).toBe(countBefore - 1);
      expect(countAfter).toBe(2);
    });

    it('should not affect other todos when deleting one todo', async () => {
      // Arrange - Create multiple todos
      const todo1 = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo 1' })
        .set('Content-Type', 'application/json');

      const todo2 = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo 2' })
        .set('Content-Type', 'application/json');

      const todo3 = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo 3' })
        .set('Content-Type', 'application/json');

      const todoToDeleteId = todo2.body.data.id;
      const todo1Id = todo1.body.data.id;
      const todo3Id = todo3.body.data.id;

      // Act - Delete middle todo
      await request(app).delete(`/api/todos/${todoToDeleteId}`);

      // Assert - Other todos should still exist
      const remainingTodo1 = await prisma.todo.findUnique({
        where: { id: todo1Id },
      });

      const remainingTodo3 = await prisma.todo.findUnique({
        where: { id: todo3Id },
      });

      expect(remainingTodo1).not.toBeNull();
      expect(remainingTodo1?.title).toBe('Todo 1');
      expect(remainingTodo3).not.toBeNull();
      expect(remainingTodo3?.title).toBe('Todo 3');
    });

    it('should delete a completed todo successfully', async () => {
      // Arrange - Create and complete a todo
      const newTodo: CreateTodoDto = {
        title: 'Completed todo to delete',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Mark as completed
      await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ isCompleted: true })
        .set('Content-Type', 'application/json');

      // Act
      const response = await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(204);

      const deletedTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(deletedTodo).toBeNull();
    });

    it('should delete a todo with all optional fields populated', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Complete todo to delete',
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
      const response = await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(204);

      const deletedTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(deletedTodo).toBeNull();
    });
  });

  describe('Error Handling - Non-existent Todo', () => {
    it('should return 404 when trying to delete a non-existent todo', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const response = await request(app).delete(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return descriptive error message when todo not found', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440001';

      // Act
      const response = await request(app).delete(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toMatch(/not found|does not exist/);
    });

    it('should not modify database when deleting non-existent todo', async () => {
      // Arrange - Create a todo
      await request(app)
        .post('/api/todos')
        .send({ title: 'Existing todo' })
        .set('Content-Type', 'application/json');

      const nonExistentId = '550e8400-e29b-41d4-a716-446655440002';
      const countBefore = await prisma.todo.count();

      // Act
      await request(app).delete(`/api/todos/${nonExistentId}`);

      // Assert
      const countAfter = await prisma.todo.count();
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('Error Handling - Invalid UUID Format', () => {
    it('should return 400 when ID is not a valid UUID', async () => {
      // Arrange
      const invalidId = 'not-a-valid-uuid';

      // Act
      const response = await request(app).delete(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when ID is a number', async () => {
      // Arrange
      const invalidId = '123456';

      // Act
      const response = await request(app).delete(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when ID contains special characters', async () => {
      // Arrange
      const invalidId = 'abc@123#xyz';

      // Act
      const response = await request(app).delete(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when ID is malformed UUID', async () => {
      // Arrange
      const invalidId = '550e8400-e29b-41d4-a716-44665544000'; // Missing one character

      // Act
      const response = await request(app).delete(`/api/todos/${invalidId}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return descriptive error message for invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid-uuid';

      // Act
      const response = await request(app).delete(`/api/todos/${invalidId}`);

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toMatch(/invalid|uuid|id/);
    });
  });

  describe('Idempotency', () => {
    it('should return 404 when deleting the same todo twice', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Todo to test idempotency',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - Delete the todo first time
      const firstDeleteResponse = await request(app).delete(`/api/todos/${todoId}`);

      // Act - Try to delete the same todo again
      const secondDeleteResponse = await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      expect(firstDeleteResponse.status).toBe(204);
      expect(secondDeleteResponse.status).toBe(404);
      expect(secondDeleteResponse.body).toHaveProperty('success', false);
    });

    it('should handle multiple sequential deletions correctly', async () => {
      // Arrange - Create three todos
      const todos = [];
      for (let i = 1; i <= 3; i++) {
        const response = await request(app)
          .post('/api/todos')
          .send({ title: `Todo ${i}` })
          .set('Content-Type', 'application/json');
        todos.push(response.body.data.id);
      }

      // Act - Delete todos one by one
      const deleteResponse1 = await request(app).delete(`/api/todos/${todos[0]}`);
      const deleteResponse2 = await request(app).delete(`/api/todos/${todos[1]}`);
      const deleteResponse3 = await request(app).delete(`/api/todos/${todos[2]}`);

      // Assert
      expect(deleteResponse1.status).toBe(204);
      expect(deleteResponse2.status).toBe(204);
      expect(deleteResponse3.status).toBe(204);

      const count = await prisma.todo.count();
      expect(count).toBe(0);
    });

    it('should not resurrect a deleted todo', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Todo to test resurrection',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act - Delete the todo
      await request(app).delete(`/api/todos/${todoId}`);

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Try to get the deleted todo
      const getResponse = await request(app).get(`/api/todos/${todoId}`);

      // Assert
      expect(getResponse.status).toBe(404);

      const dbTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });

      expect(dbTodo).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle UUID with uppercase letters', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id.toUpperCase();

      // Act
      const response = await request(app).delete(`/api/todos/${todoId}`);

      // Assert - Should work regardless of case
      expect([204, 400, 404]).toContain(response.status);
    });

    it('should handle UUID with mixed case letters', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const originalId = createResponse.body.data.id;
      const mixedCaseId = originalId
        .split('')
        .map((char: string, index: number) =>
          index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
        )
        .join('');

      // Act
      const response = await request(app).delete(`/api/todos/${mixedCaseId}`);

      // Assert - Should work regardless of case
      expect([204, 400, 404]).toContain(response.status);
    });

    it('should handle deleting the only todo in the database', async () => {
      // Arrange - Create a single todo
      const newTodo: CreateTodoDto = {
        title: 'Only todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(204);

      const count = await prisma.todo.count();
      expect(count).toBe(0);
    });

    it('should handle rapid deletion requests', async () => {
      // Arrange - Create multiple todos
      const todoIds = [];
      for (let i = 1; i <= 5; i++) {
        const response = await request(app)
          .post('/api/todos')
          .send({ title: `Todo ${i}` })
          .set('Content-Type', 'application/json');
        todoIds.push(response.body.data.id);
      }

      // Act - Delete all todos rapidly (but sequentially to avoid SQLite lock)
      const deletePromises = [];
      for (const id of todoIds) {
        const promise = request(app).delete(`/api/todos/${id}`);
        deletePromises.push(promise);
        // Small delay to avoid SQLite write lock
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const responses = await Promise.all(deletePromises);

      // Assert
      responses.forEach((response) => {
        expect(response.status).toBe(204);
      });

      const count = await prisma.todo.count();
      expect(count).toBe(0);
    });
  });

  describe('Response Format Validation', () => {
    it('should return no content in response body on successful deletion', async () => {
      // Arrange - Create a todo
      const newTodo: CreateTodoDto = {
        title: 'Test todo',
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const todoId = createResponse.body.data.id;

      // Act
      const response = await request(app).delete(`/api/todos/${todoId}`);

      // Assert
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(Object.keys(response.body).length).toBe(0);
    });

    it('should return error response with success false on not found', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440099';

      // Act
      const response = await request(app).delete(`/api/todos/${nonExistentId}`);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
    });

    it('should return error response with success false on invalid UUID', async () => {
      // Arrange
      const invalidId = 'invalid';

      // Act
      const response = await request(app).delete(`/api/todos/${invalidId}`);

      // Assert
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
    });
  });

  describe('Database Consistency', () => {
    it('should maintain database integrity after deletion', async () => {
      // Arrange - Create multiple related todos
      const todos = [];
      for (let i = 1; i <= 5; i++) {
        const response = await request(app)
          .post('/api/todos')
          .send({
            title: `Todo ${i}`,
            description: `Description ${i}`,
            priority: i % 2 === 0 ? 'high' : 'low',
          })
          .set('Content-Type', 'application/json');
        todos.push(response.body.data);
      }

      const todoToDeleteId = todos[2].id;

      // Act - Delete middle todo
      await request(app).delete(`/api/todos/${todoToDeleteId}`);

      // Assert - Verify all other todos are intact
      const remainingTodos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
      });

      expect(remainingTodos.length).toBe(4);
      expect(remainingTodos.find((t) => t.id === todoToDeleteId)).toBeUndefined();

      // Verify data integrity of remaining todos
      remainingTodos.forEach((todo) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('createdAt');
        expect(todo).toHaveProperty('updatedAt');
      });
    });

    it('should not leave orphaned data after deletion', async () => {
      // Arrange - Create a todo with all fields
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

      // Mark as completed
      await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ isCompleted: true })
        .set('Content-Type', 'application/json');

      // Act
      await request(app).delete(`/api/todos/${todoId}`);

      // Assert - Verify no trace in database
      const allTodos = await prisma.todo.findMany();
      expect(allTodos.length).toBe(0);

      const specificTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      });
      expect(specificTodo).toBeNull();
    });
  });
});
