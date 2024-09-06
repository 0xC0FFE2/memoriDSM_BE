import express from 'express';
import { publishVoca } from '../controllers/publish-voca.controller';

const router = express.Router();

router.get('/:id', publishVoca);

export default router;