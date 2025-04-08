import cors from 'cors'
import express from 'express'
import authRouter from './auth/auth.routes'

const app = express()
const PORT = process.env.PORT || 3001
app.use(
  cors({
    origin: 'http://localhost:3000', // Reemplaza con el dominio de tu aplicación Next.js
    credentials: true, // Habilita el envío de cookies
  }),
)
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

//TODO: improve this
const routerV1 = express.Router()
routerV1.use('/auth', authRouter)
app.use('/v1', routerV1)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})
