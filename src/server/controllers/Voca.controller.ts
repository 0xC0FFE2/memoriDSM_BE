// vocas.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Vocas } from '../entity/Vocas';
import { ZPS } from '../entity/ZPS';
import { CreateVocasDto, UpdateVocasDto } from '../dto/Vocas.dto';

const vocasRepository = AppDataSource.getRepository(Vocas);
const zpsRepository = AppDataSource.getRepository(ZPS);

export const getVocas = async (req: Request, res: Response) => {
    try {
        const vocas = await vocasRepository.find({ relations: ['zps'] });
        res.json(vocas);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vocas', error });
    }
};

export const getVoca = async (req: Request, res: Response) => {
    try {
        const voca = await vocasRepository.findOne({
            where: { voca_id: req.params.id },
            relations: ['zps']
        });
        if (!voca) {
            res.status(404).json({ message: "Voca not found" });
            return;
        }
        res.json(voca);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving voca', error });
    }
};

export const createVoca = async (req: Request, res: Response) => {
    try {
        const { zps_id, ...vocaData } = req.body as CreateVocasDto;
        const zps = await zpsRepository.findOne({ where: { zps_id } });
        if (!zps) {
            res.status(404).json({ message: 'ZPS not found' });
            return;
        }
        const newVoca = vocasRepository.create({ ...vocaData, zps });
        await vocasRepository.save(newVoca);
        res.status(201).json(newVoca);
    } catch (error) {
        res.status(500).json({ message: 'Error creating voca', error });
    }
};

export const updateVoca = async (req: Request, res: Response) => {
    try {
        const { zps_id, ...updateData } = req.body as UpdateVocasDto;
        const voca = await vocasRepository.findOne({
            where: { voca_id: req.params.id },
            relations: ['zps']
        });
        if (!voca) {
            res.status(404).json({ message: "Voca not found" });
            return;
        }
        if (zps_id) {
            const zps = await zpsRepository.findOne({ where: { zps_id } });
            if (!zps) {
                res.status(404).json({ message: 'ZPS not found' });
                return;
            }
            voca.zps = zps;
        }
        vocasRepository.merge(voca, updateData);
        const updatedVoca = await vocasRepository.save(voca);
        res.json(updatedVoca);
    } catch (error) {
        res.status(500).json({ message: 'Error updating voca', error });
    }
};

export const deleteVoca = async (req: Request, res: Response) => {
    try {
        const voca = await vocasRepository.findOne({ where: { voca_id: req.params.id } });
        if (!voca) {
            res.status(404).json({ message: "Voca not found" });
            return;
        }
        await vocasRepository.remove(voca);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting voca', error });
    }
};
