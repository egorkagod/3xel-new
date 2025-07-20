import classes from './Header.module.scss'
import cartIcon from '../../public/images/cart-icon.png'
import classNames from 'classnames'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cart from './Cart/Cart'
import { useSelector } from 'react-redux'

export default function Header() {
    const cartData = useSelector(state => state.cart.items)
    const isAuthorized = useSelector(state => state.profile.authorized)

    const [activeMenu, setActiveMenu] = useState(false)
    const [activeCart, setActiveCart] = useState(false)
    const cartRef = useRef(null)
    const cartButtonRef = useRef(null)

    const handleClickOverCart = (event) => {
        if (cartRef.current && !cartRef.current.contains(event.target) && cartButtonRef.current && !cartButtonRef.current.contains(event.target)) setActiveCart(false)
    }

    useEffect(() => {
        if (activeCart) {
            document.addEventListener('mousedown', handleClickOverCart)
        } else {
            document.removeEventListener('mousedown', handleClickOverCart)
        }

        return () => document.removeEventListener('mousedown', handleClickOverCart)
    }, [activeCart])

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
                    <li className={classes.profileBlockItem} ref={cartButtonRef}>
                        <svg ref={cartButtonRef} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classes.cartIcon} onClick={() => setActiveCart(prev => !prev)} width='30' height='30'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>

                        <button ref={cartButtonRef} className={classes.cartBtn} onClick={() => setActiveCart(prev => !prev)}>Корзина: {cartData.length}</button>
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
            <Cart ref={cartRef} cartData={cartData} isActive={activeCart} onClick={() => setActiveCart(prev => !prev)} toPay={() => setActiveCart(false)}></Cart>
        </header>
    )
}