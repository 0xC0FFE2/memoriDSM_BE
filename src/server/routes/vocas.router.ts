import express from 'express';
import { getVocas, getVoca, createVoca, updateVoca, deleteVoca } from '../controllers/voca.controller';

const router = express.Router();

router.get('/', getVocas);
router.get('/:id', getVoca);
router.post('/', createVoca);
router.put('/:id', updateVoca);
router.delete('/:id', deleteVoca);

export default router;