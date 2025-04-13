import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './auth/auth.routes'
import morgan from 'morgan'

const app = express()
const PORT = process.env.PORT || 3001
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000', // Reemplaza con el dominio de tu aplicación Next.js
    credentials: true, // Habilita el envío de cookies
  }),
)
app.use(express.json())

const routerV1 = express.Router()
routerV1.use('/auth', authRouter)
app.use('/v1', routerV1)

app.get('/v1/clients', (req, res) => {
  res.send('ok')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})
