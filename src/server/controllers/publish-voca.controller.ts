import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { Vocas } from '../entity/Vocas';
import { Class } from '../entity/Class';
import { ZPS } from '../entity/ZPS';

const vocasRepository = AppDataSource.getRepository(Vocas);
const classRepository = AppDataSource.getRepository(Class);
const zpsRepository = AppDataSource.getRepository(ZPS);

export const publishVoca = async (req: Request, res: Response) => {
    const { id } = req.params; // 반명
    try {
        // 반 ID로 Class 엔티티에서 해당 반의 정보를 찾음
        const classInfo = await classRepository.findOne({
            where: { class_name: id },
            relations: ['selected_zps']
        });

        if (!classInfo) {
            res.status(404).json({ message: "Class not found" });
            return;
        }

        const { selected_zps, last_invt, change_amount } = classInfo;

        // 찾은 zps에 해당하는 Vocas 엔티티에서 단어 목록을 가져옴
        const todayVoca = await vocasRepository.find({
            where: { zps: { zps_id: selected_zps.zps_id } },
            order: { sequence_number: "ASC" }, // 숫자 기준 오름차순 정렬
            skip: last_invt, // last_invt에 맞춰 시작
            take: change_amount, // 오늘의 단어량 만큼 가져옴
            relations: ['zps']
        });

        if (!todayVoca || todayVoca.length === 0) {
            res.status(404).json({ message: "Vocabulary not found" });
            return;
        }

        res.json(todayVoca);
    } catch (error) {
        console.error('Error in getVocas:', error);
        res.status(500).json({ message: 'Error fetching vocabulary' });
    }
};