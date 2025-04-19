import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import morgan from 'morgan'
import { getAuthRouter } from './auth/auth.routes'

const app = express()
const PORT = process.env.PORT || 3001
app.use(morgan('dev'))
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(express.json())

const routerV1 = express.Router()

routerV1.use('/auth', getAuthRouter())
app.use('/v1', routerV1)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})
