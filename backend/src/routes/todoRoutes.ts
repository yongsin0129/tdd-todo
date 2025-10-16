import { Router } from 'express';
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

const router = Router();

router.post('/todos', createTodo);
router.get('/todos', getAllTodos);
router.get('/todos/:id', getTodoById);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

export default router;
