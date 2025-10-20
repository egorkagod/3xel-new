import classes from './Header.module.scss'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import Button from '../Button/Button'
import { Link } from 'react-router-dom'
import Profile from '../Profile/Profile'
import { HashLink } from 'react-router-hash-link'
import { useSelector } from 'react-redux'

export default function Header() {

    const [isActive, setIsActive] = useState(false)
    const [modalIsActive, setModalIsActive] = useState(false)
    const user = useSelector((state) => state.user.data)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setModalIsActive(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <header className={classes.header}>
            <Profile isActive={modalIsActive} onClose={() => setModalIsActive(false)} />
            <div className={classNames(classes.burgerMenu, { [classes.active]: isActive })} onClick={() => setIsActive(prev => !prev)}>
                <span></span>
            </div>
            <nav className={classes.navigationContainer}>
                <Link style={{ all: 'unset' }} to='/'>
                    <div className={classes.brand}>
                        <div className={classes.logo}></div>
                        <span>3XEL</span>
                    </div>
                </Link>
                <ul className={classNames(classes.navigation, { [classes.active]: isActive })}>
                    <HashLink style={{ all: 'unset' }} smooth to='/#catalogue'>
                        <li className={classes.navBtn} onClick={() => setIsActive(false)}>
                            Каталог
                        </li>
                    </HashLink>
                    <HashLink style={{ all: 'unset' }} smooth to='/#certificates'>
                        <li className={classes.navBtn} onClick={() => setIsActive(false)}>
                            Подарочные сертификаты
                        </li>
                    </HashLink>
                    <li className={classes.navBtn} onClick={() => setIsActive(false)}>
                        Как снять видео?
                    </li>
                    <Link style={{ all: 'unset' }} to='/discounts'>
                        <li className={classes.navBtn} onClick={() => setIsActive(false)}>
                            Система скидок
                        </li>
                    </Link>
                    <HashLink style={{ all: 'unset' }} smooth to='/#process'>
                        <li className={classes.navBtn} onClick={() => setIsActive(false)}>
                            Процесс
                        </li>
                    </HashLink>
                    <HashLink style={{ all: 'unset' }} smooth to='/#about'>
                        <li className={classes.navBtn} onClick={() => setIsActive(false)}>
                            О нас
                        </li>
                    </HashLink>
                    <li onClick={() => setIsActive(false)}>
                        <Link style={{ all: 'unset' }} to='/constructor'><Button color='white'>Открыть конструктор</Button></Link>
                    </li>
                    <li onClick={() => setIsActive(false)}>
                        <Button color='white' onClick={() => setModalIsActive(true)}>
                            {user ? 'Профиль' : 'Войти'}
                        </Button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
