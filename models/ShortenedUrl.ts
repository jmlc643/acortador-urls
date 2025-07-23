// Genermae una entidad para postgresql llamada ShortenedUrl

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShortenedUrl {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    originalUrl!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    shortenedCode!: string;
}