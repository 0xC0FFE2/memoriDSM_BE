import express from 'express';
import { getClasses, getClass, createClass, updateClass, deleteClass, incrementLastInvt, decrementLastInvt, toggleIsPublic } from '../controllers/class.controller';

const router = express.Router();

router.get('/', getClasses);
router.get('/:name', getClass);
router.post('/', createClass);
router.put('/:name', updateClass);
router.delete('/:name', deleteClass);
router.post('/zps_up/:name', incrementLastInvt);
router.post('/zps_down/:name', decrementLastInvt);
router.post('/privacy/:name', toggleIsPublic);

export default router;