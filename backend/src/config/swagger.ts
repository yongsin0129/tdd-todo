import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TodoList API',
      version: '1.0.0',
      description:
        'A simple and efficient Todo List API built with Node.js, Express, and TypeScript. Supports CRUD operations for managing daily tasks.',
      contact: {
        name: 'API Support',
        email: 'support@todolist.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.todolist.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Todos',
        description: 'Todo management endpoints',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          required: ['id', 'title', 'isCompleted', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the todo',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Title of the todo',
              example: 'Buy groceries',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Detailed description of the todo',
              example: 'Buy milk, eggs, and bread from the supermarket',
            },
            isCompleted: {
              type: 'boolean',
              description: 'Completion status of the todo',
              example: false,
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              nullable: true,
              description: 'Priority level of the todo',
              example: 'medium',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Due date for the todo',
              example: '2025-12-31T23:59:59.999Z',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Timestamp when the todo was marked as completed',
              example: '2025-10-16T10:30:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the todo was created',
              example: '2025-10-16T08:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the todo was last updated',
              example: '2025-10-16T10:30:00.000Z',
            },
          },
        },
        CreateTodoRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Title of the todo',
              example: 'Buy groceries',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Detailed description of the todo',
              example: 'Buy milk, eggs, and bread from the supermarket',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              nullable: true,
              description: 'Priority level of the todo',
              example: 'medium',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Due date for the todo',
              example: '2025-12-31T23:59:59.999Z',
            },
          },
        },
        UpdateTodoRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Title of the todo',
              example: 'Buy groceries and cook dinner',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Detailed description of the todo',
              example: 'Updated description',
            },
            isCompleted: {
              type: 'boolean',
              description: 'Completion status of the todo',
              example: true,
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              nullable: true,
              description: 'Priority level of the todo',
              example: 'high',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Due date for the todo',
              example: '2025-12-31T23:59:59.999Z',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Todo' },
                {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Todo' },
                },
              ],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Todo not found',
            },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
