import classes from './SignUp.module.scss'
import VideoFrame from '../MainPage/VideoFrame/VideoFrame'
import emailIcon from '/images/email-icon.png'
import passwordIcon from '/images/password-icon.png'
import userIcon from '/images/user-icon.png'
import openedEye from '/images/opened-eye.png'
import closedEye from '/images/closed-eye.png'
import toMainArrowIcon from '/images/arrow-to-main.png'
import { useState } from 'react'
import classNames from 'classnames'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { setEnteredEmail, setEnteredPassword, setEnteredName } from '../store/signUpSlice'
import { toast } from 'react-toastify'

export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const valid = async () => {
        let hasError = false

        setNameError('')
        setEmailError('')
        setPasswordError('')
        setConfirmPasswordError('')

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (name.trim().toLowerCase() === '') {
            setNameError('Поле должно быть заполнено')
            hasError = true
        }

        if (email.trim().toLowerCase() === '') {
            setEmailError('Поле должно быть заполнено')
            hasError = true
        } else if (!emailRegex.test(email.trim())) {
            setEmailError('Введите корректный Email')
            hasError = true
        }

        if (password.trim() === '') {
            setPasswordError('Поле должно быть заполнено')
            hasError = true
        } else if (password.length < 8) {
            setPasswordError('Пароль должен содержать не менее 8 символов')
            hasError = true
        } else if (!/[a-zA-Z]/.test(password)) {
            setPasswordError('Пароль должен содержать хотя бы одну букву')
            hasError = true
        } else if (!/[0-9]/.test(password)) {
            setPasswordError('Пароль должен модержать хотя бы одну цифру')
            hasError = true
        } else if (/[а-яё]/i.test(password)) {
            setPasswordError('Пароль не должен содержать русских букв')
            hasError = true
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError('Пароли не совпадают')
            hasError = true
        } else if (confirmPassword === '') {
            setConfirmPasswordError('Поле должно быть заполнено')
            hasError = true
        }

        if (!hasError) {
            setIsLoading(true)
            try {
                const response = await fetch(`http://localhost:8000/api-root/code/?email=${email}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('Что-то пошло не так')
                }

                navigate('/confirm-email')
                dispatch(setEnteredEmail(email))
                dispatch(setEnteredPassword(password))
                dispatch(setEnteredName(name))
            } catch (error) {
                toast.error(error.message)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className={classes.globalContainer}>
            <button className={classes.toMainBtn} onClick={() => navigate('/login')}><img src={toMainArrowIcon} alt="arrow" style={{ width: '30px', height: '30px' }} />Назад</button>
            <VideoFrame></VideoFrame>
            <div className={classes.overlay}>
                <div className={classes.signUpBlock}>
                    <h2>Регистрация</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        valid()
                    }}>

                        <div className={classes.formField}>
                            <div className={classes.inputField}>
                                <img src={userIcon} alt="" aria-hidden="true" />
                                <input type="text" name='name' autoComplete='given-name' autoCapitalize='words' placeholder='Ваше имя' onFocus={() => setNameError('')} onChange={(e) => setName(e.target.value)} className={classNames(classes.input, { [classes.notValid]: nameError })} />
                            </div>
                            <span>{nameError}</span>
                        </div>
                        <div className={classes.formField}>
                            <div className={classes.inputField}>
                                <img src={emailIcon} alt="" aria-hidden="true" />
                                <input type="text" name='email' autoComplete='email' placeholder='Email' autoCorrect="off" autoCapitalize="off" onFocus={() => setEmailError('')} onChange={(e) => setEmail(e.target.value)} className={classNames(classes.input, { [classes.notValid]: emailError })} />
                            </div>
                            <span>{emailError}</span>
                        </div>
                        <div className={classes.formField}>
                            <div className={classes.inputField}>
                                <img src={passwordIcon} alt="" aria-hidden="true" />
                                <input type={showPassword ? 'text' : 'password'} name='password' autoComplete='new-password' placeholder='Придумайте пароль' autoCorrect="off" autoCapitalize="off" onFocus={() => setPasswordError('')} onChange={(e) => setPassword(e.target.value)} className={classNames(classes.input, { [classes.notValid]: passwordError })} style={{ padding: '10px 30px 10px 10px' }} />
                                <button type='button' style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }} onClick={() => setShowPassword(prev => !prev)}><img style={{ width: '25px', height: '25px' }} src={showPassword ? openedEye : closedEye} alt="show password" /></button>
                            </div>
                            <span>{passwordError}</span>
                        </div>
                        <div className={classes.formField}>
                            <div className={classes.inputField}>
                                <img src={passwordIcon} alt="" aria-hidden="true" />
                                <input type={showConfirmPassword ? 'text' : 'password'} name='confirmPassword' autoComplete='new-password' placeholder='Повторите пароль' autoCorrect="off" autoCapitalize="off" onFocus={() => setConfirmPasswordError('')} onChange={(e) => setConfirmPassword(e.target.value)} className={classNames(classes.input, { [classes.notValid]: confirmPasswordError })} style={{ padding: '10px 30px 10px 10px' }} />
                                <button type='button' style={{ all: 'unset', cursor: 'pointer', position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }} onClick={() => setShowConfirmPassword(prev => !prev)}><img style={{ width: '25px', height: '25px' }} src={showConfirmPassword ? openedEye : closedEye} alt="show password" /></button>
                            </div>
                            <span>{confirmPasswordError}</span>
                        </div>

                        <button type='submit' className={classes.signUpBtn} disabled={isLoading}>{isLoading ? 'Отправляем...' : 'Зарегистрироваться'}</button>

                    </form>
                </div>
            </div>
        </div>
    )
}