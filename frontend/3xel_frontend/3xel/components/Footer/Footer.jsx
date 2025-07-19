import classes from './Footer.module.scss'
import sdekLogo from '../../public/images/sdek_logo.png'
import tLogo from '../../public/images/t_pay_logo.svg'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className={classes.globalContainer}>
            <div className={classes.infoBlock}>
                <h4>О магазине:</h4>
                <ul>
                    <li><Link to='/about'>О нас</Link></li>
                    <li><Link to='/catalogue'>Каталог</Link></li>
                </ul>
            </div>
            <div className={classes.infoBlock}>
                <h4>Контакты:</h4>
                <ul>
                    <li><a href="tel:78988998912">+78988998912</a></li>
                    <li><a href="mailto:example@example.com">example@example.com</a></li>
                </ul>
            </div>
            <div className={classes.infoBlock}>
                <ul>
                    <h4>Покупателям:</h4>
                    <li><a href="#">Возврат</a></li>
                    <li><a href="#">Покупка</a></li>
                    <li><a href="#">Доставка</a></li>
                </ul>
            </div>

            <span className={classes.copyrights}>© 2025 3xel. Все права защищены</span>
            <div className={classes.partners}>
                <img src={sdekLogo} alt="sdek logo" className={classes.sdekLogo} />
                <img src={tLogo} alt="t pay logo" className={classes.tLogo} />
            </div>

        </footer>
    )
}