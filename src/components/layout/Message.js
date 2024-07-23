import { useState, useEffect } from 'react'
import styles from './Message.module.css'


function Message({ type, msg }) {

    const [visible, setVisible] = useState(false)

    useEffect(() => { //useEffect sempre deve estar ligado a alguém

        if(!msg) {  //Se a mensagem não exisite return false, se não return true. Não precisa nem fazer o else
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(() => { //Esse é o timer para eliminar a mensagem após 3 segundos
            setVisible(false)
        }, 3000)

        return () => clearTimeout(timer) //finalizo o timer

    }, [msg])

    return (
        (<>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>
                {msg}
            </div>
            )}
        </>)
    )
}

export default Message