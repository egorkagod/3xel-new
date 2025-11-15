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
                <li className={classes.telegram}>Telegram: <a href="https://t.me/shop_3xel" target='_blank' rel='noopener noreferrer'>@shop_3xel</a></li>
                <li className={classes.whatsapp}>WhatsApp: <a href="https://wa.me/79363338890" target="_blank" rel="noopener noreferrer">+7 (936) 333-88-90</a></li>
            </ul>
            <ul>
                <li className={classes.docsHeader}><h4>Пользователю:</h4></li>
                <li><a href="/files/Публичная_оферта_интернет_магазин_изготовления_бюстов_1.pdf" target='_blank'>Оферта</a></li>
                <li><a href="/files/Политика_конфиденциальности_интернет_магазин_изготовления_бюстов.pdf" target='_blank'>Политика конфиденциальности</a></li>
            </ul>

            <span className={classes.copyright}>© {currentYear} 3xel. Все права защищены</span>
        </footer>
    )
}