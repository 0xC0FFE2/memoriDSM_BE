import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource'; 
import { User } from '../entity/User'; 
import { CreateUserDto, UpdateUserDto } from '../dto/User.dto';

const userRepository = AppDataSource.getRepository(User);

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({
            userId: req.params.id,
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = userRepository.create(req.body as CreateUserDto);
        await userRepository.save(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({
            userId: req.params.id,
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        userRepository.merge(user, req.body as UpdateUserDto);
        const updatedUser = await userRepository.save(user);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({
            userId: req.params.id
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await userRepository.remove(user);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
