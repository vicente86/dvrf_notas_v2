import { useEffect, useState } from 'react'
import { BarraFerramentaHori, ContainerGeral, MensagemModal, NotaCartao, NotasContainer, SubContainerGeral } from './estiloGlobal/estilosG'
import { CgSoftwareDownload, CgSoftwareUpload } from 'react-icons/cg'
import { IoMdAdd } from 'react-icons/io'
import LogoImg from './assets/anotaai.png'
import apiAxios from './servicos/axios'


function App() {
  const [listaNotas, setListaNotas] = useState([])
  const [mostraModal, setMostraModal] = useState(true)
  const [novoAtualizar, setNovoAtualizar] = useState(false)
  const [chaveUpdate, setChaveUpdate] = useState(0)
  const [objMenssagem, setObjMenssagem] = useState({titulo: "", mensa: "", mostrar: false, cor: "verde"})

  useEffect(() => {
    buscandoNotas()
  }, [])
  

  // temporizador da animação
  function tempoAnima(){
    const el = document.querySelector("#modalanima")
    el.classList.add("aparece")
    setTimeout(()=>{el.classList.remove("aparece")}, 5000)
  }

    
  // Salva as notas
  async function salvaNota(){

    if(novoAtualizar === false){
      
      setMostraModal(!mostraModal)
  
      let elementos = document.querySelectorAll(".modal p")
      if(elementos[0].innerHTML.trim() === "" || elementos[1].innerHTML.trim() === ""){
        setMostraModal(!mostraModal)
        return
      }
      
      let obj = {
        titulo: elementos[0].innerHTML.trim(),
        conteudo: elementos[1].innerHTML.trim()
      }
      
      const result = await apiAxios.post(`/novanota/${obj.titulo}/${obj.conteudo}`)
      
      buscandoNotas("SUCESSO", "Gravado com sucesso", "verde")
      tempoAnima()
      setMostraModal(!mostraModal)
    }
    else {
      let elementos = document.querySelectorAll(".modal p")
      let id = chaveUpdate

      let titulo = elementos[0].innerHTML;
      let conteudo = elementos[1].innerHTML;
      
      const atualizar = await apiAxios.put(`/atualizarnota`, {titulo, conteudo, id})

      
      elementos[0].innerHTML = ""
      elementos[1].innerHTML = ""
      
      setMostraModal(!mostraModal)
      setChaveUpdate(0)
      setNovoAtualizar(!novoAtualizar)
      
      if(atualizar.data.statusCode == 400){
        buscandoNotas("FALHA", "Falha na atualização", "amarelo")
        tempoAnima()
      }else if(atualizar.data.statusCode == 200){
        buscandoNotas("SUCESSO", "Atualizado com sucesso", "verde")
        tempoAnima()
      }

    }

    
  }

  // Apaga o conteúdo do modal com a nota e mostra ela na tela
  function cancelarNota(){

    let elementos = document.querySelectorAll(".modal p")

    elementos[0].innerHTML = ""
    elementos[1].innerHTML = ""
    
    setMostraModal(!mostraModal)
  }

  // 
  async function novoOuAtualizar(atualizar = "0", e){
    cancelarNota()
    if(atualizar === "1"){
      setNovoAtualizar(!novoAtualizar)
      
      let elementos = document.querySelectorAll(".modal p")
      let nchave = Number(e.target.dataset.chave)

      const consulta = await apiAxios.get(`/buscanota/${nchave}`)

      elementos[0].innerHTML = consulta.data.resultado[0]?.titulo
      elementos[1].innerHTML = consulta.data.resultado[0]?.conteudo
      
      setChaveUpdate(nchave)
    }
  }

  //
  async function buscandoNotas(t ="", m = "", c = ""){
    const consulta = await apiAxios.get(`/buscanotas`)

    if(consulta.data.encontrou === true){
      setListaNotas(consulta.data.resultado)
      setObjMenssagem({titulo: `${t.length> 0 ? t : "SUCESSO"}`, mensa: `${m.length > 0 ? m : "registro encontrado"}`, mostrar: true, cor: `${c.length > 0 ? c : "verde"}`})
      tempoAnima()
    }else {
      setObjMenssagem({titulo: `${t.length> 0 ? t : "NADA ENCONTRADO"}`, mensa: `${m.length> 0 ? m : "Nenhum registro encontrado"}`, mostrar: true, cor: `${ c.length> 0 ? c :"amarelo"}`})
      tempoAnima()
    }
  }
  
  //
  async function deletarNota(id){
    const deletar = await apiAxios.delete(`/deletarnota/${id}`)
    if(deletar.data.funcionou == true){
      buscandoNotas("SUCESSO", "Deletado com sucesso", "verde")
      tempoAnima()
    }
  }
  


  return (
    <ContainerGeral id='containerGeral'>
      <SubContainerGeral>
        <BarraFerramentaHori>
          <p className='icone'><img src={LogoImg}/></p>
          <p className='bfhtitulo'>Anota aí</p>
          <p className='icd itemdireita2'><CgSoftwareDownload style={{fontSize: "32px"}} onClick={() => {buscandoNotas()}}/></p>
          <p className='icd itemdireita1' onClick={() => novoOuAtualizar("0")}><IoMdAdd style={{fontSize: "32px"}}/></p>
        </BarraFerramentaHori>

          <div className='containerModal' style={{visibility: mostraModal? "hidden":"visible" }}>
            <div className='modal' data-chave="">
              <div className='containerBotoesModal'>
                <button onClick={() => {if(novoAtualizar){setMostraModal(!mostraModal); setNovoAtualizar(!novoAtualizar);}else{ cancelarNota()}}}>Cancelar</button>
                {
                  novoAtualizar &&
                  <button className='del' onClick={() => {setMostraModal(!mostraModal); deletarNota(chaveUpdate);}}>Deletar</button>
                }
                <button onClick={() => {salvaNota()}}>{novoAtualizar? "Atualizar" : "Salvar"}</button>
              </div>
              <p className='titu' contentEditable suppressContentEditableWarning data-chave=""></p>
              <p className='conteudo' contentEditable suppressContentEditableWarning data-chave=""></p>
            </div>
          </div>
          
          {
            listaNotas.length === 0 ?
              <>
                <p style={{textAlign: "center", marginTop: "30px"}}>Lista de notas vazia</p>
              </>
              :
              <NotasContainer>
                {
                  listaNotas.map((l, li) => (
                    <NotaCartao key={`lista${li}`} data-chave={`${l?.id}`} onClick={(e) => {novoOuAtualizar("1", e); setNovoAtualizar(!novoAtualizar)}}>
                      <p className='titu' dangerouslySetInnerHTML={{__html: l?.titulo}} data-chave={`${l.id}`}></p>
                      <p className='conteudo' dangerouslySetInnerHTML={{__html: l?.conteudo}} data-chave={`${l.id}`}></p>
                    </NotaCartao>
                  ))
                }
              </NotasContainer>
          }


         
      </SubContainerGeral>
        
      <MensagemModal cor={objMenssagem.cor} id='modalanima'>
        <div className='titulomodal'> {objMenssagem.titulo} </div>
        <div className='conteudomodal'> {objMenssagem.mensa} </div>
      </MensagemModal>

    </ContainerGeral>
  )
}

export default App
