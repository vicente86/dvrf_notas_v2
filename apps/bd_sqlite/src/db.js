import sqlite3 from 'sqlite3'
import { open } from 'sqlite'


// Criando o banco de dados
export async function openDb () {
  return open({
    filename: './meubd.db',
    driver: sqlite3.Database
  })
}