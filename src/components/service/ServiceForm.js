import { useState } from 'react'

import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import styles from '../Projeto/ProjetoForm.module.css'

function ServiceForm({ handleSubmit, btnText, projetoData}) {
    
    const [service, setService] = useState({})
    
    function submit(e) {
        e.preventDefault()
        projetoData.services.push(service)
        handleSubmit(projetoData)
    }


    function handleChange(e) {
        setService({...service, [e.target.name]: e.target.value})
    }

    return(
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />

            <Input 
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor total"
                handleOnChange={handleChange}
            />

            <Input 
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Escreva o serviço"
                handleOnChange={handleChange}
            />

            <SubmitButton text={btnText} />
        </form>
    )
}

export default ServiceForm