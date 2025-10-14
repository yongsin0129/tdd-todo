import { Router } from 'express';
import { createTodo, getAllTodos } from '../controllers/todoController';

const router = Router();

router.post('/todos', createTodo);
router.get('/todos', getAllTodos);

export default router;
