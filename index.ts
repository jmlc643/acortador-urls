import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import AppDataSource from './db'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_, res) => {
    res.send('<h1>Hola, mundo con Express!</h1>');
})

app.post('/api/v1/urls', (req, res) => {
    const originalUrl = req.body

    if (!originalUrl || !originalUrl.url) {
        return res.status(400).json({ error: 'URL original es requerida' })
    }

    // Verificar que sea una url autentica
    try {
        new URL(originalUrl.url)
    } catch (error) {
        return res.status(400).json({ error: 'URL no válida' })
    }

    const shortCode = generateShortCode()
    const shortUrl = `http://localhost:3000/${shortCode}`

    const shortenedUrlRepository = AppDataSource.getRepository('ShortenedUrl')
    const shortenedUrl = shortenedUrlRepository.create({
        originalUrl: originalUrl.url,
        shortenedCode: shortCode
    })
    shortenedUrlRepository.save(shortenedUrl)
        .catch(error => {
            console.error('Error al guardar la URL acortada:', error)
            return res.status(500).json({ error: 'Error al guardar la URL acortada' })
        })
    return res.status(201).json({ shortUrl })
})

app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params

    const shortenedUrlRepository = AppDataSource.getRepository('ShortenedUrl')
    const shortenedUrl = await shortenedUrlRepository.findOne({ where: { shortenedCode: shortCode } })

    if (!shortenedUrl) {
        return res.status(404).json({ error: 'URL no encontrada' })
    }

    return res.redirect(shortenedUrl.originalUrl)
})

const PORT = 3000

function startServer() {
    // Conectar a la base de datos
    AppDataSource.initialize()
        .then(() => {
            console.log('Conexión a la base de datos establecida')
        })
        .catch(error => {
            console.error('Error al conectar a la base de datos:', error)
            process.exit(1)
        })
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

function generateShortCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let shortCode = ''
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        shortCode += characters[randomIndex]
    }
    return shortCode
}

startServer()