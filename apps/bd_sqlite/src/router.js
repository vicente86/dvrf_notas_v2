import { Router } from 'express'
import { atualizarNota, buscaNota, buscaNotas, deletarNota, inserirNota } from './controler/notas.js'

const router = Router()

router.get('/buscanotas', buscaNotas)
router.get('/buscanota/:id', buscaNota)
router.put('/atualizarnota', atualizarNota)
router.post('/novanota/:titulo/:conteudo', inserirNota)
router.delete('/deletarnota/:id', deletarNota)


export default router