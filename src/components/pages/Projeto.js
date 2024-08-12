import { parse, v4 as uuidv4 } from 'uuid'

import styles from './Projeto.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjetoForm from '../Projeto/ProjetoForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Projeto () {
    const { id } = useParams()
    
    const [projeto, setProjeto] = useState([])
    const [services, setServices] = useState([])
    const [showProjetoForm, setShowProjetoForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`${process.env.REACT_SERVER_API}/projects/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'Application/json',
                },
            }).then(resp => resp.json())
            .then((data) => {
                setProjeto(data)
                setServices(data.services)
            })
            .catch(err => console.log)
        }, 300)
    }, [id])

    function editPost(projeto) {
        setMessage('')
        //budget validation
        if(projeto.budget < projeto.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto')
            setType('error')
            return false
        }

        fetch(`${process.env.REACT_SERVER_API}/projects/${projeto.id}`, {
            method: 'PATCH',
            headers: { 
             'Content-Type': 'application/json'
            },
            body: JSON.stringify(projeto),
        })
        .then(resp => resp.json())
        .then((data) => {

            setProjeto(data)
            setShowProjetoForm(false)
            setMessage('Projeto atualizado')
            setType('sucess')

        })
        .catch(err => console.log(err))
    }

    function createService(projeto) {
        setMessage('')

        // last service
        const lastService = projeto.services[projeto.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(projeto.cost) + parseFloat(lastServiceCost)

        // maximum value validation
        if(newCost > parseFloat(projeto.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            projeto.services.pop()
            return false
        }

        //adicionar o custo do serviço ao custo total do projeto
        projeto.cost = newCost

        //atualizar projeto
        fetch(`${process.env.REACT_SERVER_API}/projects/${projeto.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projeto),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setShowServiceForm(false)
        })
        .catch((err) => console.log(err))
    }

    function removeService(id, cost) {

        const servicesUpdated = projeto.services.filter(
            (service) => service.id !== id
        )

        const projetoUpdated = projeto

        projetoUpdated.services = servicesUpdated
        projetoUpdated.cost = parseFloat(projetoUpdated.cost) - parseFloat(cost)

        fetch(`${process.env.REACT_SERVER_API}/projects/${projetoUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projetoUpdated)
        }).then((resp) => resp.json())
        .then((data) => {
            setProjeto(projetoUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
        })
        .catch(err => console.log(err))

    }

    function toggleProjetoForm () {
        setShowProjetoForm(!showProjetoForm)
    }

    function toggleServiceForm () {
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {projeto.name ? (
                <div className={styles.projeto_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                                <h1>Projeto: {projeto.name}</h1>
                                <button className={styles.bnt} onClick={toggleProjetoForm}>
                                    {!showProjetoForm ? 'Editar projeto' : 'Fechar'}
                                </button>
                                {!showProjetoForm ? (
                                    <div className={styles.projeto_info}>
                                        <p>
                                            <span>Categoria:</span> {projeto.category.name}
                                        </p>
                                        <p>
                                            <span>Total de Orçamento:</span> R${projeto.budget}
                                        </p>
                                        <p>
                                            <span>Total Utilizado</span> R${projeto.cost}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.projeto_info}>
                                        <ProjetoForm
                                         handleSubmit={editPost} 
                                         btnText="Concluir edição" 
                                         projectData={projeto} 
                                         />
                                    </div>
                                )}
                        </div>
                        <div className={styles.service_form_container}>
                                <h2>Adicione um serviço:</h2>
                                <button className={styles.bnt} onClick={toggleServiceForm}>
                                    {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                                </button>
                                <div className={styles.projeto_info}>
                                    {showServiceForm && <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar serviço"
                                        projetoData={projeto}
                                    />}
                                </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 &&<p>Não serviços cadastrados.</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Projeto