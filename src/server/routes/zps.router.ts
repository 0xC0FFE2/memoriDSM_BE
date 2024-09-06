import express from 'express';
import { getZPSs, getZPS, createZPS, updateZPS, deleteZPS } from '../controllers/zps.controller';

const router = express.Router();

router.get('/', getZPSs);
router.get('/:id', getZPS);
router.post('/', createZPS);
router.put('/:id', updateZPS);
router.delete('/:id', deleteZPS);

export default router;