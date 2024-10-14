import express from 'express';
import { AppDataSource } from './config/datasource'; // Adjust import path as necessary
import userRouter from './routes/user.router';
import zpsRouter from './routes/zps.router';
import classRouter from './routes/class.router';
import vocasRouter from './routes/vocas.router';
import publishRouter from './routes/publish-voca.router'

import cors from 'cors';
import { json, urlencoded } from 'express';
import { USER_PROTECT } from './middleware/Auth.middleware';

const app = express();
const PORT = process.env.PORT || 4000;
app.use(json());
app.use(cors({
    origin: 'https://memori-dsm.ncloud.sbs', 
    credentials: true,                                         
}));

app.use(urlencoded({ extended: true }))

app.use('/api/users', USER_PROTECT, userRouter);
app.use('/api/zps', USER_PROTECT, zpsRouter);
app.use('/api/classes', USER_PROTECT, classRouter);
app.use('/api/vocas', USER_PROTECT, vocasRouter);
app.use('/api/readVoca', publishRouter);

AppDataSource.initialize().then(() => {
    console.log('Database connected');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Error connecting to the database', error));