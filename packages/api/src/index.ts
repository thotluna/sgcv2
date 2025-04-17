import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './auth/auth.routes'
import morgan from 'morgan'
import { customerRouter } from './customer/customer.route'

const app = express()
const PORT = process.env.PORT || 3001
app.use(morgan('combined'))
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
routerV1.use('/customers', customerRouter)
app.use('/v1', routerV1)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})
