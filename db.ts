// Conexion con typeorm a base de datos
import { DataSource } from 'typeorm';
import { ShortenedUrl } from './models/ShortenedUrl';
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    database: 'shortened',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    synchronize: true,
    logging: false,
    entities: [ShortenedUrl],
    migrations: [],
    subscribers: [],
});

export default AppDataSource