import classes from './Footer.module.scss'
import { Link } from 'react-router-dom'

export default function Footer() {

    const currentYear = new Date().getFullYear()

    return (
        <footer className={classes.footer}>
            <div className={classes.brand}>
                <div className={classes.logo}></div>
                <span>3XEL</span>
            </div>
            <ul>
                <Link style={{ all: 'unset' }} to='/'><li>Главная</li></Link>
                <Link style={{ all: 'unset' }} to='/constructor#goods'><li>Конструктор</li></Link>
                <Link style={{ all: 'unset' }} to='/instruction'><li>Как снять видео?</li></Link>
                <Link style={{ all: 'unset' }} to='/discounts'><li>Система скидок</li></Link>
            </ul>
            <ul>
                <li className={classes.contactsHeader}><h4>Контакты:</h4></li>
                <li><a href="tel:+79363338890">+7 (936) 333-88-90</a></li>
                <li className={classes.telegram}>Telegram: @shop_3xel</li>
                <li className={classes.whatsapp}>WhatsApp: +7 (936) 333-88-90</li>
            </ul>
            <ul>
                <li className={classes.docsHeader}><h4>Пользователю:</h4></li>
                <li><a href="/files/offer_3xel.pdf" target='_blank'>Оферта</a></li>
                <li><a href="/files/privacy_policy_3xel.pdf" target='_blank'>Политика конфиденциальности</a></li>
            </ul>

            <span className={classes.copyright}>© {currentYear} 3xel. Все права защищены</span>
        </footer>
    )
}