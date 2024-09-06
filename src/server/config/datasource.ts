import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Class } from '../entity/Class';
import { Vocas } from '../entity/Vocas';
import { ZPS } from '../entity/ZPS';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [User, Class, Vocas, ZPS],
    synchronize: true,
    logging: false,
});
