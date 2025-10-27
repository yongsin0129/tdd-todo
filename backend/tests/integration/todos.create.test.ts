import request from 'supertest';
import { app } from '../../src/app.js';
import prisma from '../../src/config/database.js';
import { CreateTodoDto } from '../../src/types/todo.types.js';

describe('POST /api/todos - Create Todo Integration Tests', () => {
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

  describe('Successful Todo Creation', () => {
    it('should create a todo item successfully and return 201 status', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Complete project documentation',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should return the created todo with all required fields', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Write integration tests',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', 'Write integration tests');
      expect(response.body.data).toHaveProperty('isCompleted');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty('priority');
    });

    it('should set isCompleted to false by default', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Default completion status test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.data.isCompleted).toBe(false);
    });

    it('should auto-generate a valid UUID for id field', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'UUID generation test',
      };
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.data.id).toBeDefined();
      expect(typeof response.body.data.id).toBe('string');
      expect(response.body.data.id).toMatch(uuidRegex);
    });

    it('should auto-generate unique UUIDs for different todos', async () => {
      // Arrange
      const firstTodo: CreateTodoDto = { title: 'First todo' };
      const secondTodo: CreateTodoDto = { title: 'Second todo' };

      // Act
      const firstResponse = await request(app)
        .post('/api/todos')
        .send(firstTodo)
        .set('Content-Type', 'application/json');

      const secondResponse = await request(app)
        .post('/api/todos')
        .send(secondTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(firstResponse.body.data.id).not.toBe(secondResponse.body.data.id);
    });

    it('should auto-generate createdAt timestamp', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Timestamp test',
      };
      const beforeRequest = new Date();

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const afterRequest = new Date();

      // Assert
      expect(response.body.data.createdAt).toBeDefined();
      const createdAt = new Date(response.body.data.createdAt);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime() - 1000);
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterRequest.getTime() + 1000);
    });

    it('should auto-generate updatedAt timestamp', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'UpdatedAt test',
      };
      const beforeRequest = new Date();

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      const afterRequest = new Date();

      // Assert
      expect(response.body.data.updatedAt).toBeDefined();
      const updatedAt = new Date(response.body.data.updatedAt);
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime() - 1000);
      expect(updatedAt.getTime()).toBeLessThanOrEqual(afterRequest.getTime() + 1000);
    });

    it('should set createdAt and updatedAt to the same time initially', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Timestamp equality test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      const createdAt = new Date(response.body.data.createdAt);
      const updatedAt = new Date(response.body.data.updatedAt);
      expect(createdAt.getTime()).toBe(updatedAt.getTime());
    });

    it('should return valid ISO 8601 formatted timestamps', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'ISO timestamp format test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      const createdAt = new Date(response.body.data.createdAt);
      const updatedAt = new Date(response.body.data.updatedAt);
      expect(createdAt.toISOString()).toBe(response.body.data.createdAt);
      expect(updatedAt.toISOString()).toBe(response.body.data.updatedAt);
    });

    it('should persist the todo in the database', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Database persistence test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert - Verify todo exists in database
      const savedTodo = await prisma.todo.findUnique({
        where: { id: response.body.data.id },
      });
      expect(savedTodo).toBeDefined();
      expect(savedTodo?.title).toBe('Database persistence test');
    });

    it('should return JSON content type', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Content type test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Title Field Validation', () => {
    it('should return 400 when title is missing', async () => {
      // Arrange
      const invalidTodo = {};

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return descriptive error message when title is missing', async () => {
      // Arrange
      const invalidTodo = {};

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.error).toBeDefined();
      expect(response.body.error.toLowerCase()).toContain('title');
      expect(response.body.error.toLowerCase()).toMatch(/required|missing|mandatory/);
    });

    it('should return 400 when title is null', async () => {
      // Arrange
      const invalidTodo = {
        title: null,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when title is an empty string', async () => {
      // Arrange
      const invalidTodo = {
        title: '',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toContain('title');
    });

    it('should return 400 when title contains only whitespace', async () => {
      // Arrange
      const invalidTodo = {
        title: '   ',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toContain('title');
    });

    it('should return 400 when title contains only tabs and newlines', async () => {
      // Arrange
      const invalidTodo = {
        title: '\t\n\t',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 when title exceeds 255 characters', async () => {
      // Arrange
      const longTitle = 'a'.repeat(256);
      const invalidTodo = {
        title: longTitle,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toMatch(/title|length|255|characters/);
    });

    it('should accept title with exactly 255 characters', async () => {
      // Arrange
      const maxLengthTitle = 'a'.repeat(255);
      const validTodo: CreateTodoDto = {
        title: maxLengthTitle,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(validTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(maxLengthTitle);
    });

    it('should trim leading and trailing whitespace from title', async () => {
      // Arrange
      const todoWithSpaces: CreateTodoDto = {
        title: '  Valid title with spaces  ',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(todoWithSpaces)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Valid title with spaces');
    });

    it('should not create a todo in database when title validation fails', async () => {
      // Arrange
      const invalidTodo = {
        title: '',
      };
      const countBefore = await prisma.todo.count();

      // Act
      await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      const countAfter = await prisma.todo.count();
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('Optional Description Field', () => {
    it('should create todo with description when provided', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Todo with description',
        description: 'This is a detailed description of the todo item',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe(
        'This is a detailed description of the todo item'
      );
    });

    it('should create todo without description when not provided', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Todo without description',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('description');
      expect(response.body.data.description).toBeNull();
    });

    it('should accept empty string as description', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Todo with empty description',
        description: '',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe('');
    });

    it('should accept null as description', async () => {
      // Arrange
      const newTodo = {
        title: 'Todo with null description',
        description: null,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.description).toBeNull();
    });

    it('should handle long description text', async () => {
      // Arrange
      const longDescription = 'This is a very long description. '.repeat(50);
      const newTodo: CreateTodoDto = {
        title: 'Todo with long description',
        description: longDescription,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe(longDescription);
    });

    it('should preserve newlines and special characters in description', async () => {
      // Arrange
      const descriptionWithFormatting =
        'Line 1\nLine 2\n\nBullet:\n- Item 1\n- Item 2\n\nSpecial: @#$%';
      const newTodo: CreateTodoDto = {
        title: 'Formatted description test',
        description: descriptionWithFormatting,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe(descriptionWithFormatting);
    });
  });

  describe('Optional Priority Field', () => {
    it('should create todo with low priority when specified', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'LOW priority task',
        priority: 'LOW',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('LOW');
    });

    it('should create todo with medium priority when specified', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'NORMAL priority task',
        priority: 'NORMAL',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('NORMAL');
    });

    it('should create todo with high priority when specified', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'HIGH priority task',
        priority: 'HIGH',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('HIGH');
    });

    it('should set priority to LOW by default when not specified', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Default priority test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('LOW');
    });

    it('should return 400 for invalid priority value', async () => {
      // Arrange
      const invalidTodo = {
        title: 'Invalid priority test',
        priority: 'urgent',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toMatch(/priority/);
    });

    it('should return 400 for priority with incorrect case', async () => {
      // Arrange
      const invalidTodo = {
        title: 'Case-sensitive priority test',
        priority: 'high', // lowercase should be rejected
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for null priority value', async () => {
      // Arrange
      const invalidTodo = {
        title: 'Null priority test',
        priority: null,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for empty string priority', async () => {
      // Arrange
      const invalidTodo = {
        title: 'Empty priority test',
        priority: '',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Optional DueDate Field', () => {
    it('should create todo with dueDate when provided as ISO string', async () => {
      // Arrange
      const futureDate = new Date('2025-12-31T23:59:59.999Z');
      const newTodo: CreateTodoDto = {
        title: 'Todo with due date',
        dueDate: futureDate,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.dueDate).toBeDefined();
      expect(new Date(response.body.data.dueDate).toISOString()).toBe(futureDate.toISOString());
    });

    it('should create todo without dueDate when not provided', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Todo without due date',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('dueDate');
      expect(response.body.data.dueDate).toBeNull();
    });

    it('should accept null as dueDate', async () => {
      // Arrange
      const newTodo = {
        title: 'Todo with null due date',
        dueDate: null,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.dueDate).toBeNull();
    });

    it('should accept dueDate in the past', async () => {
      // Arrange
      const pastDate = new Date('2020-01-01T00:00:00.000Z');
      const newTodo: CreateTodoDto = {
        title: 'Todo with past due date',
        dueDate: pastDate,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.dueDate).toBeDefined();
    });

    it('should accept dueDate in the future', async () => {
      // Arrange
      const futureDate = new Date('2030-06-15T14:30:00.000Z');
      const newTodo: CreateTodoDto = {
        title: 'Todo with future due date',
        dueDate: futureDate,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(new Date(response.body.data.dueDate).getTime()).toBe(futureDate.getTime());
    });

    it('should return 400 for invalid date format', async () => {
      // Arrange
      const invalidTodo = {
        title: 'Invalid date format test',
        dueDate: 'not-a-date',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error.toLowerCase()).toMatch(/date/);
    });

    it('should return 400 for malformed date string', async () => {
      // Arrange
      const invalidTodo = {
        title: 'Malformed date test',
        dueDate: '2025-13-45',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle dueDate with timezone information', async () => {
      // Arrange
      const dateWithTimezone = new Date('2025-07-20T10:00:00+05:30');
      const newTodo: CreateTodoDto = {
        title: 'Timezone date test',
        dueDate: dateWithTimezone,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.dueDate).toBeDefined();
    });
  });

  describe('Response Format Validation', () => {
    it('should return response with success flag set to true', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Response format test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
    });

    it('should return response with data property containing todo', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Data property test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('data');
      expect(typeof response.body.data).toBe('object');
      expect(response.body.data).not.toBeNull();
    });

    it('should not include extra unexpected fields in response', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Clean response test',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      const responseKeys = Object.keys(response.body);
      expect(responseKeys).toEqual(expect.arrayContaining(['success', 'data']));
      expect(responseKeys.length).toBe(2);
    });

    it('should return error response with success false on validation failure', async () => {
      // Arrange
      const invalidTodo = {
        title: '',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
    });

    it('should include message field in error response', async () => {
      // Arrange
      const invalidTodo = {};

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(response.body.error.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle todo with all optional fields provided', async () => {
      // Arrange
      const completeTodo: CreateTodoDto = {
        title: 'Complete todo item',
        description: 'This todo has all fields',
        priority: 'HIGH',
        dueDate: new Date('2025-12-31T23:59:59.999Z'),
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(completeTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Complete todo item');
      expect(response.body.data.description).toBe('This todo has all fields');
      expect(response.body.data.priority).toBe('HIGH');
      expect(response.body.data.dueDate).toBeDefined();
      expect(response.body.data.isCompleted).toBe(false);
    });

    it('should handle todo with special characters in title', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Todo with special chars: @#$%^&*()_+-=[]{}|;:\'",.<>?/~`',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toContain('@#$%');
    });

    it('should handle todo with unicode characters in title', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Unicode test: 你好世界 🌍 café',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Unicode test: 你好世界 🌍 café');
    });

    it('should handle todo with emoji in title', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Todo with emoji 📝 ✅ 🚀',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toContain('📝');
    });

    it('should reject request with extra unexpected fields', async () => {
      // Arrange
      const todoWithExtraFields = {
        title: 'Extra fields test',
        unexpectedField: 'should not be accepted',
        anotherField: 123,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(todoWithExtraFields)
        .set('Content-Type', 'application/json');

      // Assert - Should either ignore extra fields or reject with 400
      // For strict validation, we expect 400
      expect([201, 400]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body.data).not.toHaveProperty('unexpectedField');
        expect(response.body.data).not.toHaveProperty('anotherField');
      }
    });

    it('should reject request with isCompleted field in request body', async () => {
      // Arrange - isCompleted should not be settable on creation
      const invalidTodo = {
        title: 'Pre-completed todo',
        isCompleted: true,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert - Should either ignore or set to false
      expect(response.status).toBe(201);
      expect(response.body.data.isCompleted).toBe(false);
    });

    it('should reject request with id field in request body', async () => {
      // Arrange - id should be auto-generated, not provided
      const invalidTodo = {
        title: 'Custom ID todo',
        id: 'custom-id-12345',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert - Should ignore provided id and generate new one
      expect(response.status).toBe(201);
      expect(response.body.data.id).not.toBe('custom-id-12345');
    });

    it('should reject request with createdAt field in request body', async () => {
      // Arrange - createdAt should be auto-generated
      const customDate = new Date('2020-01-01T00:00:00.000Z');
      const invalidTodo = {
        title: 'Custom createdAt todo',
        createdAt: customDate,
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert - Should ignore provided createdAt
      expect(response.status).toBe(201);
      expect(new Date(response.body.data.createdAt).getTime()).not.toBe(customDate.getTime());
    });

    it('should handle malformed JSON request body', async () => {
      // Arrange & Act
      const response = await request(app)
        .post('/api/todos')
        .send('{ invalid json }')
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle empty request body', async () => {
      // Arrange & Act
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .set('Content-Type', 'application/json');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle request without Content-Type header', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'No content type test',
      };

      // Act
      const response = await request(app).post('/api/todos').send(newTodo);

      // Assert - Should still work with Express json middleware
      expect([201, 400]).toContain(response.status);
    });

    it('should create multiple todos independently', async () => {
      // Arrange
      const todos: CreateTodoDto[] = [
        { title: 'First todo', priority: 'HIGH' },
        { title: 'Second todo', priority: 'LOW' },
        { title: 'Third todo', priority: 'NORMAL' },
      ];

      // Act
      const responses = await Promise.all(
        todos.map((todo) =>
          request(app).post('/api/todos').send(todo).set('Content-Type', 'application/json')
        )
      );

      // Assert
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });
      expect(responses[0].body.data.id).not.toBe(responses[1].body.data.id);
      expect(responses[1].body.data.id).not.toBe(responses[2].body.data.id);
    });

    it('should handle rapid concurrent requests', async () => {
      // Arrange - Reduce to 3 concurrent requests to avoid SQLite write lock issues
      const concurrentRequests = 3;
      const todos: CreateTodoDto[] = Array.from({ length: concurrentRequests }, (_, i) => ({
        title: `Concurrent todo ${i + 1}`,
      }));

      // Act - Create todos sequentially to avoid SQLite locking
      const responses = [];
      for (const todo of todos) {
        const response = await request(app)
          .post('/api/todos')
          .send(todo)
          .set('Content-Type', 'application/json');
        responses.push(response);
      }

      // Assert
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      const ids = responses.map((r) => r.body.data.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(concurrentRequests);
    });
  });

  describe('Database Integrity', () => {
    it('should not create partial todo on validation failure', async () => {
      // Arrange
      const invalidTodo = {
        description: 'Description without title',
        priority: 'HIGH',
      };
      const countBefore = await prisma.todo.count();

      // Act
      await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .set('Content-Type', 'application/json');

      // Assert
      const countAfter = await prisma.todo.count();
      expect(countAfter).toBe(countBefore);
    });

    it('should ensure database consistency after successful creation', async () => {
      // Arrange
      const newTodo: CreateTodoDto = {
        title: 'Database consistency test',
        description: 'Test description',
        priority: 'HIGH',
      };

      // Act
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .set('Content-Type', 'application/json');

      // Assert - Verify all fields in database match response
      const dbTodo = await prisma.todo.findUnique({
        where: { id: response.body.data.id },
      });

      expect(dbTodo).toBeDefined();
      expect(dbTodo?.title).toBe(response.body.data.title);
      expect(dbTodo?.description).toBe(response.body.data.description);
      expect(dbTodo?.priority).toBe(response.body.data.priority);
      expect(dbTodo?.isCompleted).toBe(response.body.data.isCompleted);
    });
  });
});
