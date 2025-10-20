import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import classes from '../SignIn/SignIn.module.scss'
import Button from '../../Button/Button'
import {
  registerUser,
  requestEmailCode,
} from '../../../store/userSlice'

export default function SignUp({ onClose, onSwitchToSignIn }) {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const emailValue = watch('email')
  const passwordValue = watch('password')

  const registerStatus = useSelector(
    (state) => state.user.registerStatus,
  )
  const registerError = useSelector(
    (state) => state.user.registerError,
  )
  const codeStatus = useSelector((state) => state.user.codeStatus)
  const codeError = useSelector((state) => state.user.codeError)

  useEffect(() => {
    if (registerStatus === 'failed' && registerError) {
      toast.error(registerError)
    }
  }, [registerStatus, registerError])

  useEffect(() => {
    if (codeStatus === 'failed' && codeError) {
      toast.error(codeError)
    }
  }, [codeStatus, codeError])

  const handleGetCode = async () => {
    if (!emailValue) {
      setError('email', {
        type: 'manual',
        message: 'Укажите email',
      })
      return
    }
    clearErrors('email')
    try {
      await dispatch(
        requestEmailCode({ email: emailValue, isRegistered: false }),
      ).unwrap()
      toast.success('Код отправлен на вашу почту')
    } catch (error) {
      toast.error(error)
    }
  }

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Пароли не совпадают',
      })
      return
    }
    try {
      await dispatch(
        registerUser({
          email: data.email,
          password: data.password,
          name: data.name,
          email_code: data.code,
        }),
      ).unwrap()
      toast.success('Регистрация прошла успешно')
      onClose()
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <div className={classes.signInBlock}>
      <header className={classes.modalHeader}>
        <h4>Регистрация</h4>
      </header>
      <div className={classes.grid}>
        <form
          className={classes.signInForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={classes.formField}>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              placeholder="Введите имя"
              {...register('name', { required: 'Имя обязательно' })}
            />
            {errors.name ? (
              <span className={classes.errorText}>
                {errors.name.message}
              </span>
            ) : null}
          </div>

          <div className={classes.formField}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              {...register('email', { required: 'Email обязателен' })}
            />
            {errors.email ? (
              <span className={classes.errorText}>
                {errors.email.message}
              </span>
            ) : null}
          </div>

          <div className={classes.inlineRow}>
            <div className={classes.formField}>
              <label htmlFor="code">Код подтверждения</label>
              <input
                type="number"
                id="code"
                placeholder="Введите код из письма"
                {...register('code', {
                  required: 'Введите код подтверждения',
                })}
              />
              {errors.code ? (
                <span className={classes.errorText}>
                  {errors.code.message}
                </span>
              ) : null}
            </div>
            <Button
              type="button"
              color="white"
              disabled={codeStatus === 'loading'}
              onClick={handleGetCode}
            >
              {codeStatus === 'loading'
                ? 'Отправляем...'
                : 'Получить код'}
            </Button>
          </div>

          <div className={classes.formField}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Придумайте пароль"
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Минимум 6 символов',
                },
              })}
            />
            {errors.password ? (
              <span className={classes.errorText}>
                {errors.password.message}
              </span>
            ) : null}
          </div>

          <div className={classes.formField}>
            <label htmlFor="confirmPassword">Повторите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Повторите пароль"
              {...register('confirmPassword', {
                required: 'Повторите пароль',
                validate: (value) =>
                  value === passwordValue || 'Пароли не совпадают',
              })}
            />
            {errors.confirmPassword ? (
              <span className={classes.errorText}>
                {errors.confirmPassword.message}
              </span>
            ) : null}
          </div>

          <div className={classes.buttons}>
            <Button
              type="submit"
              color="golden"
              disabled={registerStatus === 'loading'}
            >
              {registerStatus === 'loading'
                ? 'Создаем аккаунт...'
                : 'Зарегистрироваться'}
            </Button>
            <Button
              color="white"
              type="button"
              onClick={onSwitchToSignIn}
            >
              Уже зарегистрированы?
            </Button>
            <Button color="white" type="button" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
        <div className={classes.ordersHistory}>
          <span>
            Войдите или зарегистрируйтесь, чтобы смотреть историю
            заказов и совершать повторные заказы со скидкой.
          </span>
        </div>
      </div>
    </div>
  )
}
