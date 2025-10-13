import classes from './Header.module.scss'
import { useState } from 'react'
import classNames from 'classnames'
import Button from '../Button/Button'

export default function Header() {

    const [isActive, setIsActive] = useState(false)

    return (
        <header className={classes.header}>
            <div className={classNames(classes.burgerMenu, {[classes.active] : isActive})} onClick={() => setIsActive(prev => !prev)}>
                <span></span>
            </div>
            <nav className={classes.navigationContainer}>
                <div className={classes.brand}>
                    <div className={classes.logo}></div>
                    <span>3XEL</span>
                </div>
                <ul className={classNames(classes.navigation, {[classes.active] : isActive})}>
                    <li className={classes.navBtn}>
                        Каталог
                    </li>
                    <li className={classes.navBtn}>
                        Подарочные сертификаты
                    </li>
                    <li className={classes.navBtn}>
                        Как снять видео?
                    </li>
                    <li className={classes.navBtn}>
                        Система скидок
                    </li>
                    <li className={classes.navBtn}>
                        Процесс
                    </li>
                    <li className={classes.navBtn}>
                        О нас
                    </li>
                    <li>
                        <Button color='white'>Открыть конструктор</Button>
                    </li>
                    <li>
                        <Button color='white'>Личный кабинет</Button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}