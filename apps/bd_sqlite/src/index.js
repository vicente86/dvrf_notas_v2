import express from 'express'
import { openDb } from './db.js'
import { criarTabela } from './controler/notas.js'
import cors from 'cors'
import router from './router.js'

openDb()
criarTabela()

const app = express()
const port = 3050

app.use(express.json())
app.use(cors())
app.use(router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
