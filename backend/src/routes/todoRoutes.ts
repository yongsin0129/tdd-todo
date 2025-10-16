import { Router } from 'express';
import { createTodo, getAllTodos, getTodoById } from '../controllers/todoController';

const router = Router();

router.post('/todos', createTodo);
router.get('/todos', getAllTodos);
router.get('/todos/:id', getTodoById);

export default router;
