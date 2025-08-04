import classes from './ForgotPassword.module.scss'
import VideoFrame from '../MainPage/VideoFrame/VideoFrame'
import toMainArrowIcon from '/images/arrow-to-main.png'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { setRecoveryEmail } from '../../components/store/profileRecovery'
import { toast } from 'react-toastify'
import Loader from '../Loader/Loader'

export default function ForgotPassword() {

    const [enteredEmail, setEnteredEmail] = useState('')
    const [hasError, setHasError] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const submit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (enteredEmail.trim() === '' || !emailRegex.test(enteredEmail)) {
            setHasError(true)
            return
        }

        setHasError(false)
        setIsLoading(true)

        try {
            const response = await fetch(`/api-root/code/?email=${enteredEmail}&is_registered=${true}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) throw new Error()

            dispatch(setRecoveryEmail(enteredEmail))
            navigate('/confirm-password')
        } catch {
            toast.error("Ошибка при отправке кода")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.globalContainer}>
            <button className={classes.toMainBtn} onClick={() => navigate('/login')}><img src={toMainArrowIcon} alt="arrow" style={{ width: '30px', height: '30px' }} />Назад</button>
            <VideoFrame></VideoFrame>
            <div className={classes.overlay}>
                <form className={classes.forgotForm} onSubmit={(e) => { e.preventDefault(); submit() }}>
                    <h3>Введите Email, к которому привязан аккаунт</h3>
                    <input type="text" autoComplete='email' name='email' placeholder='Email' autoCorrect='off' autoCapitalize='off' className={classNames(classes.inputField, { [classes.notValid]: hasError })} onChange={(e) => setEnteredEmail(e.target.value)} onFocus={() => setHasError(false)} />
                    {hasError ? <span style={{
                        color: ' rgba(255, 0, 0, 0.6)',
                        fontSize: '14px'
                    }}>Введите корректный Email</span> : null}
                    <button type='submit' className={classes.submitBtn}>{isLoading ? (
                        <>
                            <Loader color={'white'} />
                            <span>Отправляем...</span>
                        </>
                    ) : 'Продолжить'}</button>
                </form>
            </div>
        </div>
    )
}