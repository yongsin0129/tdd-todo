import request from 'supertest';
import { Express } from 'express';
import prisma from '../src/config/database.js';
import { validatePriority } from '../src/utils/validation.js';

/**
 * Phase 6.1 - Todo Priority Feature Test Suite (CR-002)
 *
 * This test suite follows TDD principles (Red-Green-Refactor)
 * Testing the new four-level priority system: CRITICAL, HIGH, NORMAL, LOW
 *
 * Current System: low, medium, high (lowercase)
 * New System (CR-002): CRITICAL, HIGH, NORMAL, LOW (uppercase, 4 levels)
 *
 * Expected Result: All tests should FAIL initially (Red Phase)
 * After implementation, all tests should PASS (Green Phase)
 *
 * Total Tests: 78
 * - Priority Validation: 14 tests
 * - POST /api/todos: 12 tests
 * - PUT /api/todos/:id: 12 tests
 * - GET /api/todos (Filtering): 12 tests
 * - GET /api/todos (Sorting): 9 tests
 * - Edge Cases: 12 tests
 * - Backward Compatibility: 7 tests
 */

describe('Phase 6.1 - Todo Priority Feature (CR-002)', () => {
  let app: Express;

  beforeAll(async () => {
    // Setup test environment
    process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:5173';
    const { app: testApp } = await import('../src/app.js');
    app = testApp;
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.todo.deleteMany({});
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
    delete process.env.CORS_ORIGIN;
  });

  // Helper function to create a todo
  const createTodo = async (data: { title: string; priority?: string; isCompleted?: boolean }) => {
    const { isCompleted, ...createData } = data;
    const response = await request(app).post('/api/todos').send(createData);

    // If creation failed, return the error response (don't throw)
    if (response.status !== 201) {
      return response;
    }

    // If isCompleted is true, update the todo to mark it as completed
    if (isCompleted) {
      const todoId = response.body.data.id;
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ isCompleted: true });
      return updateResponse;
    }

    return response;
  };

  // Helper function to wait for a short time (for sorting tests)
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // ============================================================================
  // 1. PRIORITY VALIDATION TESTS (14 tests)
  // ============================================================================

  describe('1. Priority Validation', () => {
    test('1.1 - should accept "CRITICAL" as valid priority', () => {
      const result = validatePriority('CRITICAL');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('1.2 - should accept "HIGH" as valid priority', () => {
      const result = validatePriority('HIGH');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('1.3 - should accept "NORMAL" as valid priority', () => {
      const result = validatePriority('NORMAL');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('1.4 - should accept "LOW" as valid priority', () => {
      const result = validatePriority('LOW');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('1.5 - should reject lowercase "critical"', () => {
      const result = validatePriority('critical');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('CRITICAL');
    });

    test('1.6 - should reject invalid priority "URGENT"', () => {
      const result = validatePriority('URGENT');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.7 - should reject "MEDIUM" (not in spec)', () => {
      const result = validatePriority('MEDIUM');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.8 - should reject empty string', () => {
      const result = validatePriority('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.9 - should reject null', () => {
      const result = validatePriority(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.10 - should reject undefined', () => {
      const result = validatePriority(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.11 - should reject number 123', () => {
      const result = validatePriority(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.12 - should reject mixed case "CriTicAl"', () => {
      const result = validatePriority('CriTicAl');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.13 - should reject priority with spaces " LOW "', () => {
      const result = validatePriority(' LOW ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('1.14 - should reject special characters "HIGH!"', () => {
      const result = validatePriority('HIGH!');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  // ============================================================================
  // 2. POST /api/todos - CREATE WITH PRIORITY (12 tests)
  // ============================================================================

  describe('2. POST /api/todos - Priority Feature', () => {
    test('2.1 - should create todo with priority CRITICAL', async () => {
      const response = await createTodo({
        title: 'Fix production bug',
        priority: 'CRITICAL',
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Fix production bug');
      expect(response.body.data.priority).toBe('CRITICAL');
      expect(response.body.data.isCompleted).toBe(false);
    });

    test('2.2 - should create todo with priority HIGH', async () => {
      const response = await createTodo({
        title: 'Important task',
        priority: 'HIGH',
      });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('HIGH');
    });

    test('2.3 - should create todo with priority NORMAL', async () => {
      const response = await createTodo({
        title: 'Regular task',
        priority: 'NORMAL',
      });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('NORMAL');
    });

    test('2.4 - should create todo with priority LOW', async () => {
      const response = await createTodo({
        title: 'Minor task',
        priority: 'LOW',
      });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('LOW');
    });

    test('2.5 - should default to LOW priority when not specified', async () => {
      const response = await createTodo({
        title: 'Task without priority',
      });

      expect(response.status).toBe(201);
      expect(response.body.data.priority).toBe('LOW');
    });

    test('2.6 - should return 400 for priority explicitly set to null', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Task with null priority',
        priority: null,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('2.7 - should return 400 for invalid priority "URGENT"', async () => {
      const response = await createTodo({
        title: 'Task with invalid priority',
        priority: 'URGENT',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toMatch(/CRITICAL|HIGH|NORMAL|LOW/i);
    });

    test('2.8 - should return 400 for lowercase priority "high"', async () => {
      const response = await createTodo({
        title: 'Task with lowercase priority',
        priority: 'high',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('2.9 - should return 400 for empty priority string', async () => {
      const response = await createTodo({
        title: 'Task with empty priority',
        priority: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('2.10 - should return 400 for priority as number', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Task with number priority',
        priority: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('2.11 - should return correct response structure with priority', async () => {
      const response = await createTodo({
        title: 'Test structure',
        priority: 'HIGH',
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('isCompleted');
      expect(response.body.data).toHaveProperty('priority');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty('completedAt');
    });

    test('2.12 - should create multiple todos with different priorities', async () => {
      const priorities = ['CRITICAL', 'HIGH', 'NORMAL', 'LOW'];
      const responses = [];

      for (const priority of priorities) {
        const response = await createTodo({
          title: `Task with ${priority}`,
          priority,
        });
        responses.push(response);
      }

      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.data.priority).toBe(priorities[index]);
      });

      // Verify all todos exist
      const allTodos = await request(app).get('/api/todos');
      expect(allTodos.body.data).toHaveLength(4);
    });
  });

  // ============================================================================
  // 3. PUT /api/todos/:id - UPDATE PRIORITY (12 tests)
  // ============================================================================

  describe('3. PUT /api/todos/:id - Priority Feature', () => {
    test('3.1 - should update todo priority from LOW to CRITICAL', async () => {
      const createResponse = await createTodo({
        title: 'Initial task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'CRITICAL' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.priority).toBe('CRITICAL');
      expect(updateResponse.body.data.title).toBe('Initial task');
    });

    test('3.2 - should update todo priority from CRITICAL to HIGH', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'CRITICAL',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'HIGH' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.priority).toBe('HIGH');
    });

    test('3.3 - should update todo priority to NORMAL', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'HIGH',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'NORMAL' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.priority).toBe('NORMAL');
    });

    test('3.4 - should update todo priority to LOW', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'CRITICAL',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'LOW' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.priority).toBe('LOW');
    });

    test('3.5 - should keep priority unchanged when not included in update', async () => {
      const createResponse = await createTodo({
        title: 'Original title',
        priority: 'HIGH',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated title' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.title).toBe('Updated title');
      expect(updateResponse.body.data.priority).toBe('HIGH');
    });

    test('3.6 - should return 400 for invalid priority "MEDIUM"', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'MEDIUM' });

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.error).toBeDefined();
    });

    test('3.7 - should return 400 for lowercase priority "critical"', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'critical' });

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.error).toBeDefined();
    });

    test('3.8 - should update only priority field', async () => {
      const createResponse = await createTodo({
        title: 'Original task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;
      const originalUpdatedAt = createResponse.body.data.updatedAt;

      await wait(100); // Ensure timestamp difference

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'HIGH' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.priority).toBe('HIGH');
      expect(updateResponse.body.data.title).toBe('Original task');
      expect(updateResponse.body.data.isCompleted).toBe(false);
      expect(new Date(updateResponse.body.data.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );
    });

    test('3.9 - should return 400 for priority null value', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: null });

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.error).toBeDefined();
    });

    test('3.10 - should update priority along with title and isCompleted', async () => {
      const createResponse = await createTodo({
        title: 'Original',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app).put(`/api/todos/${todoId}`).send({
        title: 'New title',
        priority: 'CRITICAL',
        isCompleted: true,
      });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.title).toBe('New title');
      expect(updateResponse.body.data.priority).toBe('CRITICAL');
      expect(updateResponse.body.data.isCompleted).toBe(true);
      expect(updateResponse.body.data.completedAt).toBeTruthy();
    });

    test('3.11 - should update priority on completed todo', async () => {
      // Create todo first
      const createResponse = await createTodo({
        title: 'Completed task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      // Mark as completed
      await request(app).put(`/api/todos/${todoId}`).send({ isCompleted: true });

      // Update priority
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: 'HIGH' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.priority).toBe('HIGH');
      expect(updateResponse.body.data.isCompleted).toBe(true);
    });

    test('3.12 - should return 400 for priority with spaces', async () => {
      const createResponse = await createTodo({
        title: 'Task',
        priority: 'LOW',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ priority: ' CRITICAL ' });

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.error).toBeDefined();
    });
  });

  // ============================================================================
  // 4. GET /api/todos - FILTERING BY PRIORITY (12 tests)
  // ============================================================================

  describe('4. GET /api/todos - Priority Filtering', () => {
    test('4.1 - should filter by priority=CRITICAL', async () => {
      await createTodo({ title: 'Critical 1', priority: 'CRITICAL' });
      await createTodo({ title: 'High 1', priority: 'HIGH' });
      await createTodo({ title: 'Critical 2', priority: 'CRITICAL' });

      const response = await request(app).get('/api/todos?priority=CRITICAL');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((todo: any) => todo.priority === 'CRITICAL')).toBe(true);
    });

    test('4.2 - should filter by priority=HIGH', async () => {
      await createTodo({ title: 'Critical', priority: 'CRITICAL' });
      await createTodo({ title: 'High 1', priority: 'HIGH' });
      await createTodo({ title: 'High 2', priority: 'HIGH' });
      await createTodo({ title: 'Low', priority: 'LOW' });

      const response = await request(app).get('/api/todos?priority=HIGH');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((todo: any) => todo.priority === 'HIGH')).toBe(true);
    });

    test('4.3 - should filter by priority=NORMAL', async () => {
      await createTodo({ title: 'Normal 1', priority: 'NORMAL' });
      await createTodo({ title: 'High', priority: 'HIGH' });
      await createTodo({ title: 'Normal 2', priority: 'NORMAL' });

      const response = await request(app).get('/api/todos?priority=NORMAL');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((todo: any) => todo.priority === 'NORMAL')).toBe(true);
    });

    test('4.4 - should filter by priority=LOW', async () => {
      await createTodo({ title: 'Low 1', priority: 'LOW' });
      await createTodo({ title: 'Critical', priority: 'CRITICAL' });
      await createTodo({ title: 'Low 2', priority: 'LOW' });

      const response = await request(app).get('/api/todos?priority=LOW');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((todo: any) => todo.priority === 'LOW')).toBe(true);
    });

    test('4.5 - should filter by priority + isCompleted (combined)', async () => {
      await createTodo({ title: 'Critical Uncompleted', priority: 'CRITICAL', isCompleted: false });
      await createTodo({ title: 'Critical Completed', priority: 'CRITICAL', isCompleted: true });
      await createTodo({ title: 'High Uncompleted', priority: 'HIGH', isCompleted: false });

      const response = await request(app).get('/api/todos?priority=CRITICAL&isCompleted=false');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe('CRITICAL');
      expect(response.body.data[0].isCompleted).toBe(false);
    });

    test('4.6 - should filter completed todos with HIGH priority', async () => {
      await createTodo({ title: 'High Completed', priority: 'HIGH', isCompleted: true });
      await createTodo({ title: 'High Uncompleted', priority: 'HIGH', isCompleted: false });
      await createTodo({ title: 'Low Completed', priority: 'LOW', isCompleted: true });

      const response = await request(app).get('/api/todos?priority=HIGH&isCompleted=true');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe('HIGH');
      expect(response.body.data[0].isCompleted).toBe(true);
    });

    test('4.7 - should return 400 for invalid priority value', async () => {
      const response = await request(app).get('/api/todos?priority=INVALID');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('4.8 - should return 400 for lowercase priority', async () => {
      const response = await request(app).get('/api/todos?priority=low');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('4.9 - should return all todos without priority filter', async () => {
      await createTodo({ title: 'Critical', priority: 'CRITICAL' });
      await createTodo({ title: 'High', priority: 'HIGH' });
      await createTodo({ title: 'Normal', priority: 'NORMAL' });
      await createTodo({ title: 'Low', priority: 'LOW' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(4);
      response.body.data.forEach((todo: any) => {
        expect(todo).toHaveProperty('priority');
      });
    });

    test('4.10 - should return 400 for empty priority parameter', async () => {
      const response = await request(app).get('/api/todos?priority=');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('4.11 - should return empty array when no todos match filter', async () => {
      await createTodo({ title: 'Low 1', priority: 'LOW' });
      await createTodo({ title: 'Low 2', priority: 'LOW' });

      const response = await request(app).get('/api/todos?priority=CRITICAL');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });

    test('4.12 - should filter with pagination', async () => {
      // Create 10 HIGH priority todos
      for (let i = 1; i <= 10; i++) {
        await createTodo({ title: `High ${i}`, priority: 'HIGH' });
      }
      // Create 5 LOW priority todos
      for (let i = 1; i <= 5; i++) {
        await createTodo({ title: `Low ${i}`, priority: 'LOW' });
      }

      const response = await request(app).get('/api/todos?priority=HIGH&page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.data.every((todo: any) => todo.priority === 'HIGH')).toBe(true);
    });
  });

  // ============================================================================
  // 5. GET /api/todos - PRIORITY SORTING (9 tests)
  // ============================================================================

  describe('5. GET /api/todos - Priority Sorting', () => {
    test('5.1 - should sort uncompleted todos by priority', async () => {
      await createTodo({ title: 'Low', priority: 'LOW' });
      await wait(50);
      await createTodo({ title: 'Critical', priority: 'CRITICAL' });
      await wait(50);
      await createTodo({ title: 'High', priority: 'HIGH' });
      await wait(50);
      await createTodo({ title: 'Normal', priority: 'NORMAL' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(4);
      expect(response.body.data[0].priority).toBe('CRITICAL');
      expect(response.body.data[1].priority).toBe('HIGH');
      expect(response.body.data[2].priority).toBe('NORMAL');
      expect(response.body.data[3].priority).toBe('LOW');
    });

    test('5.2 - should sort completed todos by priority', async () => {
      await createTodo({ title: 'Low', priority: 'LOW', isCompleted: true });
      await wait(50);
      await createTodo({ title: 'Critical', priority: 'CRITICAL', isCompleted: true });
      await wait(50);
      await createTodo({ title: 'High', priority: 'HIGH', isCompleted: true });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].priority).toBe('CRITICAL');
      expect(response.body.data[1].priority).toBe('HIGH');
      expect(response.body.data[2].priority).toBe('LOW');
    });

    test('5.3 - should sort mixed completed/uncompleted with same priority', async () => {
      await createTodo({ title: 'High Completed', priority: 'HIGH', isCompleted: true });
      await wait(50);
      await createTodo({ title: 'High Uncompleted', priority: 'HIGH', isCompleted: false });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      // Uncompleted should come first
      expect(response.body.data[0].isCompleted).toBe(false);
      expect(response.body.data[1].isCompleted).toBe(true);
    });

    test('5.4 - should prioritize completion status over priority', async () => {
      await createTodo({ title: 'Low Uncompleted', priority: 'LOW', isCompleted: false });
      await wait(50);
      await createTodo({ title: 'Critical Completed', priority: 'CRITICAL', isCompleted: true });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      // Uncompleted LOW should come before completed CRITICAL
      expect(response.body.data[0].priority).toBe('LOW');
      expect(response.body.data[0].isCompleted).toBe(false);
      expect(response.body.data[1].priority).toBe('CRITICAL');
      expect(response.body.data[1].isCompleted).toBe(true);
    });

    test('5.5 - should sort by createdAt when priority and status are same', async () => {
      await createTodo({ title: 'Critical Old', priority: 'CRITICAL' });
      await wait(100);
      await createTodo({ title: 'Critical New', priority: 'CRITICAL' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      // Newer should come first
      expect(response.body.data[0].title).toBe('Critical New');
      expect(response.body.data[1].title).toBe('Critical Old');
    });

    test('5.6 - should apply full three-level sorting', async () => {
      // Create complex scenario
      await createTodo({ title: 'Uncompleted CRITICAL Old', priority: 'CRITICAL' });
      await wait(50);
      await createTodo({ title: 'Uncompleted CRITICAL New', priority: 'CRITICAL' });
      await wait(50);
      await createTodo({ title: 'Uncompleted HIGH', priority: 'HIGH' });
      await wait(50);
      await createTodo({ title: 'Uncompleted LOW', priority: 'LOW' });
      await wait(50);
      await createTodo({ title: 'Completed CRITICAL', priority: 'CRITICAL', isCompleted: true });
      await wait(50);
      await createTodo({ title: 'Completed HIGH', priority: 'HIGH', isCompleted: true });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(6);

      // Expected order:
      // 1. Uncompleted CRITICAL New (uncompleted, highest priority, newest)
      // 2. Uncompleted CRITICAL Old (uncompleted, highest priority, older)
      // 3. Uncompleted HIGH
      // 4. Uncompleted LOW
      // 5. Completed CRITICAL
      // 6. Completed HIGH

      expect(response.body.data[0].title).toBe('Uncompleted CRITICAL New');
      expect(response.body.data[1].title).toBe('Uncompleted CRITICAL Old');
      expect(response.body.data[2].title).toBe('Uncompleted HIGH');
      expect(response.body.data[3].title).toBe('Uncompleted LOW');
      expect(response.body.data[4].title).toBe('Completed CRITICAL');
      expect(response.body.data[5].title).toBe('Completed HIGH');
    });

    test('5.7 - should maintain sorting with 10+ todos', async () => {
      // Create 12 todos with mixed priorities and completion status
      const todoData = [
        { title: 'U-CRITICAL-1', priority: 'CRITICAL', isCompleted: false },
        { title: 'U-HIGH-1', priority: 'HIGH', isCompleted: false },
        { title: 'U-NORMAL-1', priority: 'NORMAL', isCompleted: false },
        { title: 'U-LOW-1', priority: 'LOW', isCompleted: false },
        { title: 'C-CRITICAL-1', priority: 'CRITICAL', isCompleted: true },
        { title: 'C-HIGH-1', priority: 'HIGH', isCompleted: true },
        { title: 'U-CRITICAL-2', priority: 'CRITICAL', isCompleted: false },
        { title: 'U-HIGH-2', priority: 'HIGH', isCompleted: false },
        { title: 'U-NORMAL-2', priority: 'NORMAL', isCompleted: false },
        { title: 'U-LOW-2', priority: 'LOW', isCompleted: false },
        { title: 'C-NORMAL-1', priority: 'NORMAL', isCompleted: true },
        { title: 'C-LOW-1', priority: 'LOW', isCompleted: true },
      ];

      const createdIds = [];
      for (const data of todoData) {
        const res = await createTodo(data);
        createdIds.push(res.body.data.id);
        await wait(100);
      }

      // Verify all 12 were created
      expect(createdIds).toHaveLength(12);

      // Wait a bit more to ensure all database operations are complete
      await wait(200);

      // Check database directly
      const dbCount = await prisma.todo.count();
      expect(dbCount).toBe(12); // This should help us see if the issue is in DB or API

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(12);

      // Verify all uncompleted todos come before completed todos
      const uncompletedTodos = response.body.data.filter((todo: any) => !todo.isCompleted);
      const completedTodos = response.body.data.filter((todo: any) => todo.isCompleted);

      expect(uncompletedTodos.length).toBe(8);
      expect(completedTodos.length).toBe(4);

      // Verify priorities are sorted within uncompleted
      expect(uncompletedTodos[0].priority).toBe('CRITICAL');
      expect(uncompletedTodos[1].priority).toBe('CRITICAL');
    });

    test('5.8 - should reflect updated priority in sorting', async () => {
      const response1 = await createTodo({ title: 'Task', priority: 'LOW' });
      await createTodo({ title: 'High Task', priority: 'HIGH' });

      // Update first todo to CRITICAL
      await request(app).put(`/api/todos/${response1.body.data.id}`).send({ priority: 'CRITICAL' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      // Updated todo should now be first (CRITICAL > HIGH)
      expect(response.body.data[0].priority).toBe('CRITICAL');
      expect(response.body.data[0].title).toBe('Task');
    });

    test('5.9 - should sort with pagination', async () => {
      // Create 20 todos
      for (let i = 1; i <= 5; i++) {
        await createTodo({ title: `Critical ${i}`, priority: 'CRITICAL' });
      }
      for (let i = 1; i <= 5; i++) {
        await createTodo({ title: `High ${i}`, priority: 'HIGH' });
      }
      for (let i = 1; i <= 10; i++) {
        await createTodo({ title: `Low ${i}`, priority: 'LOW' });
      }

      const response = await request(app).get('/api/todos?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      // First 5 should all be CRITICAL
      expect(response.body.data.every((todo: any) => todo.priority === 'CRITICAL')).toBe(true);
    });
  });

  // ============================================================================
  // 6. EDGE CASES & ERROR HANDLING (12 tests)
  // ============================================================================

  describe('6. Priority Feature - Edge Cases', () => {
    test('6.1 - should return 400 for empty priority string in POST', async () => {
      const response = await createTodo({
        title: 'Task',
        priority: '',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.2 - should return 400 for wrong case "Critical"', async () => {
      const response = await createTodo({
        title: 'Task',
        priority: 'Critical',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.3 - should return 400 for priority with whitespace', async () => {
      const response = await createTodo({
        title: 'Task',
        priority: '  CRITICAL  ',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.4 - should return 400 for unicode characters in priority', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Task',
        priority: 'CRÍTICÅL',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.5 - should return 400 for very long priority string', async () => {
      const response = await createTodo({
        title: 'Task',
        priority: 'CRITICAL'.repeat(100),
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.6 - should return 400 for priority as boolean', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Task',
        priority: true,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.7 - should return 400 for priority as object', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Task',
          priority: { level: 'HIGH' },
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.8 - should return 400 for priority as array', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Task',
          priority: ['HIGH'],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.9 - should prevent SQL injection attempts', async () => {
      const response = await createTodo({
        title: 'Task',
        priority: "'; DROP TABLE todos; --",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();

      // Verify table still exists
      const allTodos = await request(app).get('/api/todos');
      expect(allTodos.status).toBe(200);
    });

    test('6.10 - should prevent XSS attempts in priority', async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Task',
        priority: "<script>alert('xss')</script>",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.11 - should return 400 for multiple priority values (array)', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Task',
          priority: ['HIGH', 'LOW'],
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('6.12 - should return 404 when updating priority on non-existent todo', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';

      const response = await request(app).put(`/api/todos/${fakeId}`).send({ priority: 'HIGH' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  // ============================================================================
  // 7. BACKWARD COMPATIBILITY (7 tests)
  // ============================================================================

  describe('7. Priority Feature - Backward Compatibility', () => {
    test('7.1 - should create todo without priority field (API v1 behavior)', async () => {
      const response = await createTodo({
        title: 'Old API style task',
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('priority');
      expect(response.body.data.priority).toBe('LOW');
    });

    test('7.2 - should retrieve old todos with default priority', async () => {
      await createTodo({ title: 'Task 1' });
      await createTodo({ title: 'Task 2' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].priority).toBe('LOW');
      expect(response.body.data[1].priority).toBe('LOW');
    });

    test('7.3 - should update old todo without touching priority', async () => {
      const createResponse = await createTodo({
        title: 'Original title',
      });
      const todoId = createResponse.body.data.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated title' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.title).toBe('Updated title');
      expect(updateResponse.body.data.priority).toBe('LOW');
    });

    test('7.4 - should filter and return old todos with default priority', async () => {
      await createTodo({ title: 'Old Task 1' });
      await createTodo({ title: 'Old Task 2' });
      await createTodo({ title: 'New Critical', priority: 'CRITICAL' });

      const response = await request(app).get('/api/todos?priority=LOW');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((todo: any) => todo.priority === 'LOW')).toBe(true);
    });

    test('7.5 - should sort old todos correctly', async () => {
      await createTodo({ title: 'Old Low Task' }); // defaults to LOW
      await wait(50);
      await createTodo({ title: 'New Critical', priority: 'CRITICAL' });

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      // CRITICAL should come before LOW
      expect(response.body.data[0].priority).toBe('CRITICAL');
      expect(response.body.data[1].priority).toBe('LOW');
    });

    test('7.6 - should paginate with mix of old and new todos', async () => {
      // Create old todos (no priority)
      for (let i = 1; i <= 5; i++) {
        await createTodo({ title: `Old ${i}` });
      }
      // Create new todos (with priority)
      for (let i = 1; i <= 5; i++) {
        await createTodo({ title: `New ${i}`, priority: 'HIGH' });
      }

      const response = await request(app).get('/api/todos?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
    });

    test('7.7 - should maintain all existing fields in response', async () => {
      const response = await createTodo({
        title: 'Complete task',
      });

      expect(response.status).toBe(201);
      // All existing fields should be present
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('isCompleted');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(response.body.data).toHaveProperty('completedAt');
      // New priority field should also be present
      expect(response.body.data).toHaveProperty('priority');
    });
  });
});
