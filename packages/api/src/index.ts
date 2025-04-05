import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.post('/v1/client/validate', async (req, res) => {
  const { clientCode } = req.body
  const data = {
    status: 'fail',
    message: 'El codigo de cliente no es valido',
    code: clientCode,
  }
  res.send(data)
})

app.listen(3001, () => {
  console.log('Example app listening on port 3000!')
})
