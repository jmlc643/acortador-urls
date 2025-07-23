import { generateShortCode } from "../utils";

describe('generateShortCode', () => {
    it('should generate a short code of 6 characters', () => {
        const shortCode = generateShortCode();
        expect(shortCode).toHaveLength(6);
    });

    it('should generate a unique short code each time', () => {
        const codes = new Set();
        for (let i = 0; i < 100; i++) {
            codes.add(generateShortCode());
        }
        expect(codes.size).toBe(100);
    });

    it('should only contain alphanumeric characters', () => {
        const shortCode = generateShortCode();
        expect(/^[a-zA-Z0-9]+$/.test(shortCode)).toBe(true);
    });
})