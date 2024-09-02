import express from 'express';
import { getClasses, getClass, createClass, updateClass, deleteClass } from '../controllers/Class.controller';

const router = express.Router();

router.get('/', getClasses);
router.get('/:name', getClass);
router.post('/', createClass);
router.put('/:name', updateClass);
router.delete('/:name', deleteClass);

export default router;