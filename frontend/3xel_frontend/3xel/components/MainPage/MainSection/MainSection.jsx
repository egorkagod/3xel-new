import classes from './MainSection.module.scss'
import { Link } from 'react-router-dom'

export default function MainSection() {
    return(
        <div className={classes.globalContainer}>
            <h2>Добро пожаловать в 3xel — ваш персональный портал в мир уникальных бюстов!</h2>
            <Link className={classes.unstyledLink} to='/catalogue'><button className={classes.toCotologueBtn}>В каталог</button></Link>
        </div>
    )
}