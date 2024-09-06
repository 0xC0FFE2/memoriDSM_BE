// zps.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { ZPS } from '../entity/ZPS';
import { CreateZPSDto, UpdateZPSDto } from '../dto/ZPS.dto';

const zpsRepository = AppDataSource.getRepository(ZPS);

export const getZPSs = async (req: Request, res: Response) => {
    try {
        const zpss = await zpsRepository.find({ relations: ['vocas', 'classes'] });
        res.json(zpss);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ZPSs', error });
    }
};

export const getZPS = async (req: Request, res: Response) => {
    try {
        const zps = await zpsRepository.findOne({
            where: { zps_id: req.params.id },
            relations: ['vocas', 'classes']
        });
        if (!zps) {
            res.status(404).json({ message: "ZPS not found" });
            return;
        }
        res.json(zps);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ZPS', error });
    }
};

export const createZPS = async (req: Request, res: Response) => {
    try {
        const zpsData = req.body as CreateZPSDto;
        const newZPS = zpsRepository.create(zpsData);
        await zpsRepository.save(newZPS);
        res.status(201).json(newZPS);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ZPS', error });
    }
};

export const updateZPS = async (req: Request, res: Response) => {
    try {
        const zpsData = req.body as UpdateZPSDto;
        const zps = await zpsRepository.findOne({ where: { zps_id: req.params.id } });
        if (!zps) {
            res.status(404).json({ message: "ZPS not found" });
            return;
        }
        zpsRepository.merge(zps, zpsData);
        const updatedZPS = await zpsRepository.save(zps);
        res.json(updatedZPS);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ZPS', error });
    }
};

export const deleteZPS = async (req: Request, res: Response) => {
    try {
        const zps = await zpsRepository.findOne({ where: { zps_id: req.params.id } });
        if (!zps) {
            res.status(404).json({ message: "ZPS not found" });
            return;
        }
        await zpsRepository.remove(zps);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ZPS', error });
    }
};
