import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Vocas } from '../entity/Vocas';
import { CreateVocasDto, UpdateVocasDto } from '../dto/Vocas.dto';
import { v4 as uuidv4 } from 'uuid';

const vocasRepository = AppDataSource.getRepository(Vocas);

export const getZps = async (req: Request, res: Response) => {
    try {
        const uniqueZps = await vocasRepository
            .createQueryBuilder('vocas')
            .select('DISTINCT vocas.zps', 'zps')
            .getRawMany();
        res.json(uniqueZps);
    } catch (error) {
        console.error('Error in getZps:', error);
        res.status(500).json({ message: 'Error fetching ZPS' });
    }
};

export const getVoca = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const voca = await vocasRepository.findOneBy({ voca_id });

        if (!voca) {
            res.status(404).json({ message: "Vocabulary not found" });
            return;
        }

        res.json(voca);
    } catch (error) {
        console.error('Error in getVoca:', error);
        res.status(500).json({ message: 'Error fetching vocabulary' });
    }
};

export const createVoca = async (req: Request, res: Response) => {
    const { word_name, word_meaning, zps } = req.body as CreateVocasDto;

    if (!word_name || !word_meaning || !zps) {
        return res.status(400).json({ message: 'All fields are required: word_name, word_meaning, zps' });
    }

    try {
        const sequenceNumber = await getNextSequenceNumber(zps);

        const newVoca = vocasRepository.create({
            voca_id: uuidv4(), // Use UUID for unique identifier
            word_name,
            word_meaning,
            zps,
            sequence_number: sequenceNumber
        });

        const savedVoca = await vocasRepository.save(newVoca);
        res.status(201).json(savedVoca);
    } catch (error) {
        console.error('Error in createVoca:', error);
        res.status(500).json({ message: 'Error creating vocabulary' });
    }
};

export const updateVoca = async (req: Request, res: Response) => {
    const { word_name, word_meaning, zps } = req.body as UpdateVocasDto;
    const id = req.params.id;

    try {
        const voca = await vocasRepository.findOneBy({ id });

        if (!voca) {
            return res.status(404).json({ message: 'Vocabulary not found' });
        }

        if (word_name !== undefined) voca.word_name = word_name;
        if (word_meaning !== undefined) voca.word_meaning = word_meaning;
        if (zps !== undefined) voca.zps = zps;

        const updatedVoca = await vocasRepository.save(voca);
        res.json(updatedVoca);
    } catch (error) {
        console.error('Error in updateVoca:', error);
        res.status(500).json({ message: 'Error updating vocabulary' });
    }
};

export const deleteVoca = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const voca = await vocasRepository.findOneBy({ voca_id });

        if (!voca) {
            res.status(404).json({ message: "Vocabulary not found" });
            return;
        }

        await vocasRepository.remove(voca);
        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteVoca:', error);
        res.status(500).json({ message: 'Error deleting vocabulary' });
    }
};

const getNextSequenceNumber = async (zps: string): Promise<number> => {
    const result = await vocasRepository
        .createQueryBuilder('vocas')
        .select('MAX(vocas.sequence_number)', 'max')
        .where('vocas.zps = :zps', { zps })
        .getRawOne();

    const maxSequence = result.max ? parseInt(result.max, 10) : 0;
    return maxSequence + 1;
};

// New function to delete all vocabularies in a specific book
export const deleteVocaBook = async (req: Request, res: Response) => {
    const zps = req.params.zps;

    try {
        const result = await vocasRepository.delete({ zps });

        if (result.affected === 0) {
            res.status(404).json({ message: "Vocabulary book not found or already empty" });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteVocaBook:', error);
        res.status(500).json({ message: 'Error deleting vocabulary book' });
    }
};
