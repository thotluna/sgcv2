import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
