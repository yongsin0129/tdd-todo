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
