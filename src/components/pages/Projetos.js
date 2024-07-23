import { useLocation } from 'react-router-dom'

import { useState, useEffect } from 'react'

import Message from '../layout/Message'
import Container from '../layout/Container'
import Loading from '../layout/Loading'
import LinkButton from '../layout/LinkButton'
import ProjetoCard from '../Projeto/ProjetoCard'

import styles from './Projetos.module.css'

function Projetos () {

    const [projetos, setprojetos] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projetoMessage, setProjetoMessage] = useState('')

    const location = useLocation()
    let message = ''
    if(location.state) {
        message = location.state.message
    }

    useEffect(() => {
        setTimeout(
            () => {
                fetch('http://localhost:5000/projects', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })  .then((resp) => resp.json())
                    .then((data) => {
                        console.log(data)
                        setprojetos(data)
                        setRemoveLoading(true)
                    })
                    .catch((err) => console.log(err))
            }, 300)
    }, [])

    function removeProjeto(id) {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((resp) => resp.json())
        .then(() => {
            setprojetos(projetos.filter((projeto) => projeto.id !== id))
            setProjetoMessage('Projeto removido com sucesso!')
        })
        .catch(err => console.log(err))
        
    }

    return (
        <div className={styles.projetos_container}>   
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/novoprojeto" text="Criar Projeto"/>
            </div>
            {message && <Message type="sucess" msg={message} />}
            {projetoMessage && <Message type="sucess" msg={projetoMessage} />}
            <Container customClass="start">
                {projetos.length > 0 &&
                    projetos.map((projeto) => 
                    <ProjetoCard 
                        id={projeto.id}
                        name={projeto.name}                     //if que só exibi os projetos se tiver projetos carregados.
                        budget={projeto.budget}                 
                        category={projeto.category.name}
                        key={projeto.id}
                        handleRemove={removeProjeto}
                    />  
                )}
                {!removeLoading && <Loading />}  
                {removeLoading && projetos.length === 0 && (
                <p>Não há projetos cadastrados</p>
                )}      
            </Container> 
        </div>
    )
}

export default Projetos