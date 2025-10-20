import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import classes from './SignIn.module.scss'
import Button from '../../Button/Button'
import { loginUser } from '../../../store/userSlice'

export default function SignIn({
  onClose,
  onSwitchToSignUp,
  onSwitchToReset,
}) {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const loginStatus = useSelector((state) => state.user.loginStatus)
  const loginError = useSelector((state) => state.user.loginError)

  useEffect(() => {
    if (loginStatus === 'failed' && loginError) {
      toast.error(loginError)
    }
  }, [loginStatus, loginError])

  const onSubmit = async (data) => {
    try {
      await dispatch(
        loginUser({ email: data.email, password: data.password }),
      ).unwrap()
      toast.success('Добро пожаловать!')
      onClose()
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <div className={classes.signInBlock}>
      <header className={classes.modalHeader}>
        <h4>Авторизация</h4>
      </header>
      <div className={classes.grid}>
        <form
          className={classes.signInForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={classes.formField}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              placeholder="email@example.com"
              id="email"
              {...register('email', { required: 'Email обязателен' })}
            />
            {errors.email ? (
              <span className={classes.errorText}>
                {errors.email.message}
              </span>
            ) : null}
          </div>
          <div className={classes.formField}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              placeholder="Пароль"
              id="password"
              {...register('password', {
                required: 'Пароль обязателен',
              })}
            />
            {errors.password ? (
              <span className={classes.errorText}>
                {errors.password.message}
              </span>
            ) : null}
          </div>
          <div className={classes.buttons}>
            <Button
              color="golden"
              type="submit"
              disabled={loginStatus === 'loading'}
            >
              {loginStatus === 'loading' ? 'Входим...' : 'Войти'}
            </Button>
            <Button color="white" type="button" onClick={onSwitchToSignUp}>
              Зарегистрироваться
            </Button>
            <Button color="white" type="button" onClick={onSwitchToReset}>
              Забыли пароль?
            </Button>
            <Button color="white" type="button" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
        <div className={classes.ordersHistory}>
          <span>
            Войдите или зарегистрируйтесь, чтобы смотреть историю заказов
            и совершать повторные заказы со скидкой.
          </span>
        </div>
      </div>
    </div>
  )
}
