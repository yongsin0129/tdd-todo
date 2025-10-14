import { Router } from 'express';
import { createTodo } from '../controllers/todoController';

const router = Router();

router.post('/todos', createTodo);

export default router;
