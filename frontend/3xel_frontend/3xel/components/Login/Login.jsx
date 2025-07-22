import classes from './Login.module.scss'
import VideoFrame from '../MainPage/VideoFrame/VideoFrame'
import loginIcon from '/images/login-form-icon.png'
import emailIcon from '/images/email-icon.png'
import passwordIcon from '/images/password-icon.png'
import openedEye from '/images/opened-eye.png'
import closedEye from '/images/closed-eye.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { getCookie } from "../../utils/cookie.js"
import { toast } from 'react-toastify'
import { setAuthorized } from '../store/profileSlice.jsx'
import { useDispatch } from 'react-redux'
import toMainArrowIcon from '/images/arrow-to-main.png'

export default function Login() {
    const [enteredEmail, setEnteredEmail] = useState('')
    const [enteredPassword, setEnteredPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatcher = useDispatch()

    const csrfToken = getCookie('csrftoken')

    const loginBtn = async (email, password) => {
        setIsLoading(true)
        setError(false)
        try {
            const response = await fetch('/api-root/login/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })

            if (response.status === 403) {
                setError(true)
                throw new Error("Неверный логин или пароль")
            }

            if (!response.ok) {
                throw new Error("Что-то пошло не так")
            }

            dispatcher(setAuthorized(true))
            navigate('/')
            toast.success('Вы успешно вошли!')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.globalContainer}>
            <button className={classes.toMainBtn} onClick={() => navigate('/')}><img src={toMainArrowIcon} alt="arrow" style={{ width: '30px', height: '30px' }} />На главную</button>
            <VideoFrame></VideoFrame>
            <div className={classes.overlay}>
                <div className={classes.loginBlock}>
                    <img src={loginIcon} alt="photo" />
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        loginBtn(enteredEmail, enteredPassword)
                    }}>

                        <div className={classes.formField}>
                            <img src={emailIcon} alt="mail" />
                            <input className={classes.emailField} type="email" placeholder='Email' autoComplete='email' onChange={(e) => setEnteredEmail(e.target.value)} />
                        </div>
                        <div className={classes.formField}>
                            <img src={passwordIcon} alt="lock" />
                            <input className={classNames(classes.passwordField, { [classes.notValid]: error })} style={{ padding: '10px 30px 10px 10px' }} type={showPassword ? 'text' : 'password'} placeholder='Пароль' autoComplete='current-password' onChange={(e) => setEnteredPassword(e.target.value)} />
                            <button type='button' style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(prev => !prev)}><img style={{ width: '25px', height: '25px' }} src={showPassword ? openedEye : closedEye} alt="show password" /></button>
                        </div>

                        <Link className={classes.link} to="/forgot-password"><i>Забыли пароль?</i></Link>
                        <button type='submit' className={classes.loginBtn} disabled={isLoading}>{isLoading ? 'Загружаем...' : 'Войти'}</button>

                    </form>

                    <span><Link className={classes.link} to="/sign-up"><i>Нет аккаунта? Зарегистрировать</i></Link></span>
                </div>
            </div>
        </div >
    )
}