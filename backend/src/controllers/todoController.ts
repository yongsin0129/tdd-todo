import { Request, Response } from 'express';
import prisma from '../config/database';

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Title is required and cannot be empty',
      });
      return;
    }

    // Trim and validate title length
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 255) {
      res.status(400).json({
        success: false,
        error: 'Title cannot exceed 255 characters',
      });
      return;
    }

    // Validate priority if provided
    if ('priority' in req.body) {
      const validPriorities = ['low', 'medium', 'high'];
      if (priority === null || priority === '' || !validPriorities.includes(priority)) {
        res.status(400).json({
          success: false,
          error: 'Priority must be one of: low, medium, high',
        });
        return;
      }
    }

    // Validate dueDate if provided
    if (dueDate !== undefined && dueDate !== null) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid date format',
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
      title: trimmedTitle,
    };

    if (description !== undefined) {
      todoData.description = description === '' ? '' : description;
    }

    if (priority && priority !== null && priority !== '') {
      todoData.priority = priority;
    }

    if (dueDate !== undefined && dueDate !== null) {
      todoData.dueDate = new Date(dueDate);
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
      error: 'Internal server error',
    });
  }
};

export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
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
      error: 'Internal server error',
    });
  }
};

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
      error: 'Internal server error',
    });
  }
};
