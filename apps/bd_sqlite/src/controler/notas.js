import { openDb } from "../db.js"

export async function criarTabela(){
    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY, titulo TEXT, conteudo TEXT)')
        db.close()
    })
}

// Reformulado
export async function inserirNota(req, res){
    openDb().then(db => {
        if(Object.keys(req.params).length > 0){
            db.run('INSERT INTO notas (titulo, conteudo) VALUES (?, ?)', [req.params.titulo, req.params.conteudo])
            res.json({"statusCode": 200})
        }else {
            res.json({"statusCode": 400})
        }
        db.close()
    })
}


// Reformulado
export async function atualizarNota(req, res){
    openDb().then(db => {
        
        if(Object.keys(req.body).length > 0){
            db.run('UPDATE notas SET titulo=?, conteudo=? WHERE id=?', [req.body.titulo, req.body.conteudo, req.body.id])
            res.json({"statusCode": 200})
        }else {
            res.json({"statusCode": 400})
        }

        db.close()
    })
}

// Reformulado
export async function buscaNotas(req, res){
    openDb().then(db => {
        db.all('SELECT * FROM notas')
        .then(notas => {
            if(notas.length > 0){ res.json({"resultado": notas, "encontrou": true}) }
            else {res.json({"resultado": notas, "encontrou": false})}
            db.close()
        })
        .catch((erro) => {console.log('erro :>> ', erro)})
    })

    openDb().then(db => { db.close()})
}

// Reformulado
export async function buscaNota(req, res){
    let id = req.params.id
    openDb().then(db => {
        db.get('SELECT * FROM notas WHERE id=?', `${id}`)
        .then(nota => {
            let arr = []
            arr.push(nota)

            if(arr.length > 0){res.json({"resultado": arr, "encontrou": true})}
            else {res.json({"resultado": arr, "encontrou": false})}
            db.close()
        })
        .catch((erro) => {console.log('erro :>> ', erro)})
    })

    openDb().then(db => {db.close()})
}

//
export async function deletarNota(req, res){
    openDb().then(db => {
        db.get('DELETE FROM notas WHERE id=?', `${req.params.id}`)
        .then(del => {
            if(del === undefined){
                res.json({"funcionou": true})
            }else {
                res.json({"funcionou": false})
            }
        })
        .catch((erro) => console.log('erro =>> ', erro))
    })

    openDb().then(db => {db.close()})
}