import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Class } from '../entity/Class';
import { CreateClassDto, UpdateClassDto } from '../dto/Class.dto';

const classRepository = AppDataSource.getRepository(Class);

export const getClasses = async (req: Request, res: Response) => {
    try {
        const classes = await classRepository.find();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving classes', error });
    }
};

export const getClass = async (req: Request, res: Response) => {
    try {
        const classItem = await classRepository.findOne({
            where: { class_name: req.params.name }
        });
        if (!classItem) {
            res.status(404).json({ message: "Class not found" });
            return;
        }
        res.json(classItem);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving class', error });
    }
};

export const createClass = async (req: Request, res: Response) => {
    try {
        const newClass = classRepository.create(req.body as CreateClassDto);
        await classRepository.save(newClass);
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Error creating class', error });
    }
};

export const updateClass = async (req: Request, res: Response) => {
    try {
        const classItem = await classRepository.findOne({
            where: { class_name: req.params.name }
        });
        if (!classItem) {
            res.status(404).json({ message: "Class not found" });
            return;
        }
        classRepository.merge(classItem, req.body as UpdateClassDto);
        const updatedClass = await classRepository.save(classItem);
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: 'Error updating class', error });
    }
};

export const deleteClass = async (req: Request, res: Response) => {
    try {
        const classItem = await classRepository.findOne({
            where: { class_name: req.params.name }
        });
        if (!classItem) {
            res.status(404).json({ message: "Class not found" });
            return;
        }
        await classRepository.remove(classItem);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting class', error });
    }
};
