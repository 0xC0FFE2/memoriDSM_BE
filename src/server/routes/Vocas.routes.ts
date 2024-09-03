import express from 'express';
import { getZps, getVoca, createVoca, updateVoca, deleteVoca, deleteVocaBook } from '../controllers/Voca.controller';

const router = express.Router();

router.get('/', getZps);
router.get('/:id', getVoca);
router.post('/', createVoca);
router.put('/:id', updateVoca);
router.delete('/:id', deleteVoca);
router.delete('/zps/:zps', deleteVocaBook);

export default router;