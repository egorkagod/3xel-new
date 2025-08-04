import classes from './ConfirmPassword.module.scss'
import classNames from 'classnames'
import { useState } from 'react'
import VideoFrame from '../../MainPage/VideoFrame/VideoFrame'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import Loader from '../../Loader/Loader'

export default function ConfirmPassword() {

    const [enteredPassword, setEnteredPassword] = useState('')
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('')
    const [enteredCode, setEnteredCode] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const email = useSelector(state => state.recovery.email)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const valid = () => {
        let localError = false
        setPasswordError(false)
        setConfirmPasswordError(false)

        if (enteredPassword === '' || !/[a-zA-Z]/.test(enteredPassword)) {
            setPasswordError(true)
            localError = true
        }

        if (enteredPassword !== enteredConfirmPassword) {
            setConfirmPasswordError(true)
            localError = true
        }

        return !localError
    }

    const submit = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api-root/user/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email_code: enteredCode, password: enteredPassword, email: email })
            })

            if (!response.ok) throw new Error()
            navigate('/login')
            toast.success('Пароль изменен!')
        } catch {
            toast.error('Ошибка при смене пароля. Проверьте код или попробуйте позже еще раз')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.globalContainer}>
            <VideoFrame></VideoFrame>
            <div className={classes.overlay}>
                <form onSubmit={(e) => { { e.preventDefault(); if (valid()) submit() } }} className={classes.confirmForm}>
                    <h2>На почту {email} был отправлен код, введите его ниже и придумайте новый пароль</h2>
                    <div className={classes.formField}>
                        <input type="text" name='code' placeholder='Ведите код' onChange={(e) => setEnteredCode(e.target.value)} className={classes.inputField} />
                    </div>
                    <div className={classes.formField}>
                        <input type="password" name='new-password' autoComplete='new-password' placeholder='Придумайте новый пароль' onChange={(e) => setEnteredPassword(e.target.value)} className={classNames(classes.inputField, { [classes.notValid]: passwordError })} />
                        {passwordError ? <span style={{
                            color: ' rgba(255, 0, 0, 0.6)',
                            fontSize: '14px'
                        }}>Введите корректный пароль</span> : null}
                    </div>
                    <div className={classes.formField}>
                        <input type="password" name='confirm-password' placeholder='Повторите пароль' onChange={(e) => setEnteredConfirmPassword(e.target.value)} className={classNames(classes.inputField, { [classes.notValid]: confirmPasswordError })} />
                        {confirmPasswordError ? <span style={{
                            color: ' rgba(255, 0, 0, 0.6)',
                            fontSize: '14px'
                        }}>Пароли не совпадают</span> : null}
                    </div>

                    <button type='submit' className={classes.submitBtn}>{isLoading ? (
                        <>

                            <Loader color={'white'} />
                            <span>Проверяем...</span>

                        </>
                    ) : 'Отправить'}</button>
                </form>
            </div>
        </div>
    )
}