import classes from './Header.module.scss'
import profileIcon from '../../public/images/profile-icon.png'
import cartIcon from '../../public/images/cart-icon.png'
import classNames from 'classnames'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cart from './Cart/Cart'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile, setAuthorized } from '../store/profileSlice'
import { getCookie } from '../../utils/cookie'
import { toast } from 'react-toastify'

export default function Header() {
    const cartData = useSelector(state => state.cart.items)
    const isAuthorized = useSelector(state => state.profile.authorized)
    const dispatcher = useDispatch()

    const [activeMenu, setActiveMenu] = useState(false)
    const [activeCart, setActiveCart] = useState(false)
    

    useEffect(() => {

        const csrfToken = getCookie('csrftoken')

        fetch('http://localhost:8000/api-root/user/', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        })
            .then(response => {
                if (response.status === 403) {
                    return
                }
                if (!response.ok) throw new Error(`Ошибка: ${response.status}, ${response.statusText}`)
                return response.json()
            })
            .then(data => {dispatcher(updateProfile(data)); dispatcher(setAuthorized(true))})
            .catch(_ => {toast.error('Ошибка загрузки профиля, войдите заново'); dispatcher(setAuthorized(false))})
    }, [])

    return (
        <header className={classes.globalContainer}>
            <div className={classNames(classes.burgerMenuBtn, { [classes.active]: activeMenu })} onClick={() => setActiveMenu(prev => !prev)}>
                <div className={classes.burgerLine}></div>
                <div className={classes.burgerLine}></div>
                <div className={classes.burgerLine}></div>
            </div>
            <div className={classes.brand}>

                <Link style={{ all: 'unset' }} to='/'><h1 className={classes.brandName}>3xel</h1></Link>
            </div>
            <nav className={classes.navbar}>
                <ul className={classNames(classes.navbarNav, { [classes.active]: activeMenu })}>
                    <li className={classes.navItem}>
                        <Link className={classes.unstyledLink} to="/"><button onClick={() => setActiveMenu(false)}>Главная</button></Link>
                    </li>
                    <li className={classes.navItem}>
                        <Link className={classes.unstyledLink} to="/catalogue"><button onClick={() => setActiveMenu(false)}>Каталог</button></Link>
                    </li>
                    <li className={classes.navItem}>
                        <Link className={classes.unstyledLink} to="/about"><button onClick={() => setActiveMenu(false)}>О нас</button></Link>
                    </li>
                </ul>
            </nav>

            <div>
                <ul className={classes.profileBlock}>
                    <li className={classes.profileBlockItem}>
                        <img src={cartIcon} alt="cart" className={classes.cartIcon} onClick={() => setActiveCart(prev => !prev)}></img>
                        <button className={classes.cartBtn} onClick={() => setActiveCart(prev => !prev)}>Корзина: {cartData.length}</button>
                    </li>
                    <li className={classes.profileBlockItem}>
                        <div className={classNames(classes.profileBtn, { [classes.disabled]: !isAuthorized })}>
                            <Link style={{ all: 'unset' }} to='/profile/info'><button style={{ all: 'unset' }}>Профиль</button></Link>
                        </div>
                    </li>
                    <li>
                        <Link className={classes.unstyledLink} to="/login"><button className={classNames(classes.loginBtn, { [classes.disabled]: isAuthorized })}>Войти</button></Link>
                    </li>
                </ul>
            </div>
            <Cart cartData={cartData} isActive={activeCart} onClick={() => setActiveCart(prev => !prev)}></Cart>
        </header>
    )
}