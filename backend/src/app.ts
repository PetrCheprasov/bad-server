import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import csrf from 'csurf'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import rateLimiter from './middlewares/rate-limiter'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

mongoose.set('sanitizeFilter', true)

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    },
})

app.use(helmet())
app.use(cookieParser())
app.use(
    cors({
        origin: ORIGIN_ALLOW,
        credentials: true,
    })
)
app.use(rateLimiter)
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(urlencoded({ extended: true, limit: '1mb' }))
app.use(json({ limit: '1mb' }))
app.use(mongoSanitize())

app.options('*', cors({ origin: ORIGIN_ALLOW, credentials: true }))
app.use(csrfProtection)
app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log('ok')
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    }
}

bootstrap()
