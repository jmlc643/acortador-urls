// Conexion con typeorm a base de datos
import { DataSource } from 'typeorm';
import { ShortenedUrl } from './models/ShortenedUrl';
import dotenv from 'dotenv';

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DATABASE, DATABASE_TEST, NODE_ENV } = process.env;

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    database: NODE_ENV === 'test' ? DATABASE_TEST : DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: parseInt(DB_PORT || '5432', 10),
    synchronize: true,
    logging: false,
    entities: [ShortenedUrl],
    migrations: [],
    subscribers: [],
});

export default AppDataSource