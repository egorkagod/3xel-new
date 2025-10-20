import classes from './SignIn.module.scss'
import Button from '../../Button/Button'

export default function SignIn({ onClick, toSignUp }) {
    return (
        <div className={classes.signInBlock}>
            <header className={classes.modalHeader}>
                <h4>Авторизация</h4>
            </header>
            <div className={classes.grid}>
                <form className={classes.signInForm}>
                    <div className={classes.formField}>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" placeholder='email@example.com' name='email' id='email' />
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" placeholder='Пароль' name='password' id='password' />
                    </div>
                    <div className={classes.buttons}>
                        <Button color='white' type='button' onClick={onClick}>Отмена</Button>
                        <Button color='golden' type='button'>Войти</Button>
                        <Button color='white' type='button' onClick={toSignUp}>Зарегистрироваться</Button>
                    </div>
                </form>
                <div className={classes.ordersHistory}>
                    <span>Войдите или зарегистрируйтесь, чтобы смотреть историю заказов и совершать повторные заказы со скидкой.</span>
                </div>
            </div>

        </div>
    )
}