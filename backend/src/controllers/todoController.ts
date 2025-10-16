import { Request, Response } from 'express';
import prisma from '../config/database';
import { handleError } from '../utils/errorHandler';
import { validateUUID, validateTitle, validatePriority, validateDate } from '../utils/validation';

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Creates a new todo item with the provided information
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoRequest'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // Validate title
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      res.status(400).json({
        success: false,
        error: titleValidation.error,
      });
      return;
    }

    // Validate priority if provided
    if ('priority' in req.body) {
      const priorityValidation = validatePriority(priority);
      if (!priorityValidation.isValid) {
        res.status(400).json({
          success: false,
          error: priorityValidation.error,
        });
        return;
      }
    }

    // Validate dueDate if provided
    if (dueDate !== undefined && dueDate !== null) {
      const dateValidation = validateDate(dueDate);
      if (!dateValidation.isValid) {
        res.status(400).json({
          success: false,
          error: dateValidation.error,
        });
        return;
      }
    }

    // Create todo with only allowed fields
    const todoData: {
      title: string;
      description?: string | null;
      priority?: string;
      dueDate?: Date | null;
    } = {
      title: titleValidation.trimmedTitle!,
    };

    if (description !== undefined) {
      todoData.description = description === '' ? '' : description;
    }

    if (priority && priority !== null && priority !== '') {
      todoData.priority = priority;
    }

    if (dueDate !== undefined && dueDate !== null) {
      const dateValidation = validateDate(dueDate);
      todoData.dueDate = dateValidation.date!;
    }

    const todo = await prisma.todo.create({
      data: todoData,
    });

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: handleError(error),
    });
  }
};

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     description: Retrieves a specific todo item by its UUID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the todo to retrieve
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request - Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate UUID format
    if (!validateUUID(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid UUID format',
      });
      return;
    }

    // Find todo by ID
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    // Check if todo exists
    if (!todo) {
      res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
      return;
    }

    // Return the todo
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: handleError(error),
    });
  }
};

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieves a list of todos with optional filtering and pagination
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: isCompleted
 *         schema:
 *           type: boolean
 *         description: Filter todos by completion status
 *         example: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page (maximum 100)
 *         example: 10
 *     responses:
 *       200:
 *         description: Todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 pagination:
 *                   type: object
 *                   description: Pagination metadata (only included if page or limit is provided)
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Bad request - Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isCompleted, page, limit } = req.query;

    // Validate isCompleted parameter
    if (isCompleted !== undefined) {
      const isCompletedLower = String(isCompleted).toLowerCase();
      if (isCompletedLower !== 'true' && isCompletedLower !== 'false') {
        res.status(400).json({
          success: false,
          error: 'isCompleted must be a boolean value (true or false)',
        });
        return;
      }
    }

    // Validate and parse page parameter
    let pageNum = 1;
    if (page !== undefined) {
      pageNum = parseInt(String(page), 10);
      if (isNaN(pageNum) || pageNum < 1) {
        res.status(400).json({
          success: false,
          error: 'Page must be a positive integer',
        });
        return;
      }
    }

    // Validate and parse limit parameter
    let limitNum = 10;
    if (limit !== undefined) {
      limitNum = parseInt(String(limit), 10);
      if (isNaN(limitNum) || limitNum < 1) {
        res.status(400).json({
          success: false,
          error: 'Limit must be a positive integer',
        });
        return;
      }
      if (limitNum > 100) {
        res.status(400).json({
          success: false,
          error: 'Limit cannot exceed maximum of 100',
        });
        return;
      }
    }

    // Build where clause for filtering
    const where: { isCompleted?: boolean } = {};
    if (isCompleted !== undefined) {
      where.isCompleted = String(isCompleted).toLowerCase() === 'true';
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination metadata
    const total = await prisma.todo.count({ where });
    const totalPages = Math.ceil(total / limitNum);

    // Fetch todos with filtering, sorting, and pagination
    const todos = await prisma.todo.findMany({
      where,
      orderBy: {
        createdAt: 'desc', // Newest first
      },
      skip,
      take: limitNum,
    });

    // Build response
    const response: {
      success: boolean;
      data: typeof todos;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    } = {
      success: true,
      data: todos,
    };

    // Include pagination metadata if pagination parameters were provided
    if (page !== undefined || limit !== undefined) {
      response.pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: handleError(error),
    });
  }
};

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Updates a specific todo item by its UUID. Supports partial updates.
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the todo to update
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoRequest'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request - Validation error or invalid UUID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, isCompleted } = req.body;

    // Validate UUID format
    if (!validateUUID(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid UUID format',
      });
      return;
    }

    // Check if request body is empty
    const hasUpdates = Object.keys(req.body).some((key) =>
      ['title', 'description', 'priority', 'dueDate', 'isCompleted'].includes(key)
    );

    if (!hasUpdates) {
      res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
      return;
    }

    // Find todo by ID
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    // Check if todo exists
    if (!existingTodo) {
      res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
      return;
    }

    // Build update data object
    const updateData: {
      title?: string;
      description?: string | null;
      priority?: string;
      dueDate?: Date | null;
      isCompleted?: boolean;
      completedAt?: Date | null;
    } = {};

    // Validate and update title if provided
    if ('title' in req.body) {
      const titleValidation = validateTitle(title);
      if (!titleValidation.isValid) {
        res.status(400).json({
          success: false,
          error: titleValidation.error,
        });
        return;
      }
      updateData.title = titleValidation.trimmedTitle!;
    }

    // Update description if provided
    if ('description' in req.body) {
      updateData.description = description === null ? null : description;
    }

    // Validate and update priority if provided
    if ('priority' in req.body) {
      const priorityValidation = validatePriority(priority);
      if (!priorityValidation.isValid) {
        res.status(400).json({
          success: false,
          error: priorityValidation.error,
        });
        return;
      }
      updateData.priority = priority;
    }

    // Validate and update dueDate if provided
    if ('dueDate' in req.body) {
      if (dueDate === null) {
        updateData.dueDate = null;
      } else {
        const dateValidation = validateDate(dueDate);
        if (!dateValidation.isValid) {
          res.status(400).json({
            success: false,
            error: dateValidation.error,
          });
          return;
        }
        updateData.dueDate = dateValidation.date!;
      }
    }

    // Handle isCompleted and completedAt
    if ('isCompleted' in req.body) {
      if (typeof isCompleted !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'isCompleted must be a boolean value',
        });
        return;
      }

      updateData.isCompleted = isCompleted;

      // Set completedAt when marking as completed
      if (isCompleted && !existingTodo.isCompleted) {
        updateData.completedAt = new Date();
      }
      // Clear completedAt when marking as not completed
      else if (!isCompleted && existingTodo.isCompleted) {
        updateData.completedAt = null;
      }
    }

    // Update todo in database
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: handleError(error),
    });
  }
};

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Permanently deletes a specific todo item by its UUID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the todo to delete
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       204:
 *         description: Todo deleted successfully (no content)
 *       400:
 *         description: Bad request - Invalid UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate UUID format
    if (!validateUUID(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid UUID format',
      });
      return;
    }

    // Find todo by ID
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    // Check if todo exists
    if (!todo) {
      res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
      return;
    }

    // Delete the todo
    await prisma.todo.delete({
      where: { id },
    });

    // Return 204 No Content
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: handleError(error),
    });
  }
};
