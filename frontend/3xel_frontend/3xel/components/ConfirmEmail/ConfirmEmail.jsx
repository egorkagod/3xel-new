import classes from './ConfirmEmail.module.scss'
import { useSelector } from 'react-redux'
import VideoFrame from '../MainPage/VideoFrame/VideoFrame'
import { useState } from 'react'
import { getCookie } from '../../utils/cookie.js'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export default function ConfirmEmail() {
    const [enteredCode, setEnteredCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const enteredEmail = useSelector(state => state.signUp.enteredEmail)
    const enteredPassword = useSelector(state => state.signUp.enteredPassword)
    const enteredName = useSelector(state => state.signUp.enteredName)
    const csrfToken = getCookie('csrftoken')
    const navigate = useNavigate()

    const confirm = async () => {
        setIsLoading(true)
        setError(false)
        try {
            const response = await fetch('/api-root/register/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ email: enteredEmail, password: enteredPassword, name: enteredName, email_code: enteredCode })
            })

            if (response.status === 403) {
                setError(true)
                throw new Error("Код неверный")
            }

            if (!response.ok) {
                throw new Error("Что-то пошло не так")
            }

            navigate('/login')
            toast.success("Вы успешно зарегистрировались!")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className={classes.globalContainer}>
            <VideoFrame />
            <div className={classes.overlay}>
                <div className={classes.confirmBlock}>
                    <h4>На почту <span>{enteredEmail}</span> было отправлено письмо с кодом для подтверждения</h4>
                    <input type="text" placeholder='Введите код из письма' onChange={(e) => setEnteredCode(e.target.value)} />
                    <button onClick={confirm} disabled={isLoading}>{isLoading ? 'Проверяем...' : 'Подтвердить'}</button>
                    {error ? <span style={{ width: '100%', textAlign: 'center', color: 'red', fontSize: '12px' }}>Неверный код</span> : null}
                </div>
            </div>
        </div>
    )
}