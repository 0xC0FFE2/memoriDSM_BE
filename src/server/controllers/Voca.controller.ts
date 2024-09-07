// vocas.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Vocas } from '../entity/Vocas';
import { ZPS } from '../entity/ZPS';
import { CreateVocasDto, UpdateVocasDto } from '../dto/Vocas.dto';
import { QueryRunner } from 'typeorm';

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
        const voca = await vocasRepository.find({
            where: { zps: { zps_id: req.params.id } },
            relations: ['zps'],
            order: { sequence_number: "ASC" }
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

        const lastVoca = await vocasRepository.findOne({
            where: { zps: { zps_id: zps_id } },
            relations: ['zps'],
            order: { sequence_number: 'DESC' }
        });
        const nextSequenceNumber = lastVoca ? lastVoca.sequence_number + 1 : 1;

        const newVoca = vocasRepository.create({ ...vocaData, zps, sequence_number: nextSequenceNumber });
        await vocasRepository.save(newVoca);
        res.status(201).json(newVoca);
    } catch (error) {
        console.log(error);
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
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const voca = await queryRunner.manager.findOne(Vocas, {
            where: { voca_id: req.params.id },
            relations: ['zps']
        });

        if (!voca) {
            res.status(404).json({ message: "Voca not found" });
            return;
        }

        const { sequence_number, zps } = voca;

        // Delete the voca
        await queryRunner.manager.remove(voca);

        // Reorder the remaining vocas
        await reorderVocasAfterDeletion(queryRunner, zps.zps_id, sequence_number);

        // Commit the transaction
        await queryRunner.commitTransaction();

        res.status(204).send();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        res.status(500).json({ message: 'Error deleting voca', error });
    } finally {
        await queryRunner.release();
    }
};

const reorderVocasAfterDeletion = async (queryRunner: QueryRunner, zpsId: string, deletedSequenceNumber: number) => {
    const vocasToUpdate = await queryRunner.manager.find(Vocas, {
        where: {
            zps: { zps_id: zpsId },
            sequence_number: deletedSequenceNumber
        },
        order: { sequence_number: 'ASC' }
    });

    for (const voca of vocasToUpdate) {
        await queryRunner.manager.decrement(Vocas, { voca_id: voca.voca_id }, 'sequence_number', 1);
    }
};