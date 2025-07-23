import { app, startServer, closeServer } from '../index'
import request from 'supertest'
import AppDataSource from '../db'

import { beforeAll, afterAll, describe, it, expect } from '@jest/globals'
import { generateShortCode } from '../utils';

describe('Short URL API', () => {
    beforeAll(async () => {
        await startServer()
    });

    afterAll(async () => {
        await closeServer()
    });

    it('should return a welcome message on root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Hola, mundo con Express!');
    });

    it('should create a short URL', async () => {
        const response = await request(app)
            .post('/api/v1/urls')
            .send({ url: 'https://example.com' });
        
        expect(response.status).toBe(201);
        expect(response.body.shortUrl).toMatch(/http:\/\/localhost:3000\/[a-zA-Z0-9]{6}/);
    });

    it('should return 400 for invalid URL', async () => {
        const response = await request(app)
            .post('/api/v1/urls')
            .send({ url: 'invalid-url' });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('URL no válida');
    });

    it('should redirect to the original URL when accessing the short URL', async () => {
        const shortCode = generateShortCode();
        const originalUrl = 'https://example.com';
        
        // Save the shortened URL manually for this test
        const shortenedUrlRepository = AppDataSource.getRepository('ShortenedUrl');
        await shortenedUrlRepository.save({
            originalUrl,
            shortenedCode: shortCode
        });

        const response = await request(app).get(`/${shortCode}`);
        
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(originalUrl);
    });

    it('should return 404 for non-existent short code', async () => {
        const response = await request(app).get('/nonexistent');
        
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('URL no encontrada');
    });
});