import { useState } from 'react'
import classes from './Cart.module.scss'
import classNames from 'classnames'
import closeBtn from '../../../public/images/close-btn.png'
import deleteBtn from '/images/cart-delete-btn.png'
import DeleteModal from './DeleteModal/DeleteModal'
import { useDispatch } from 'react-redux'
import { removeFromCart, clearCart } from '../../store/cartSlice'
import { Link } from 'react-router'

export default function Cart({ isActive, cartData, onClick }) {
    const [activeModal, setActiveModal] = useState(false)
    const [activeClearModal, setActiveClearModal] = useState(false)
    const [goodToRemove, setGoodToRemove] = useState()
    const dispatch = useDispatch()


    return (
        <div className={classNames(classes.globalContainer, { [classes.active]: isActive })}>
            <button className={classes.closeBtn}>
                <img src={closeBtn} alt="close" onClick={onClick} />
            </button>
            {cartData.length >= 0 ? (
                <>
                    <button className={classes.clearBtn} onClick={() => setActiveClearModal(true)}>
                        Очистить
                    </button>
                    <div className={classes.itemContainer}>
                        {cartData.map((item) => (
                            <div key={item.id} className={classes.cartItem}>
                                <div className={classes.productImage} style={{ backgroundImage: `url(${item.background})`, borderRadius: '6px' }}></div>
                                <div className={classes.productInfo}>
                                    <div className={classes.productTitle}>
                                        <span>{item.title}</span>
                                    </div>
                                    <div className={classes.productProperties}>
                                        <div className={classes.colorCircle} style={{ backgroundColor: item.selectedColor }}></div>
                                        <span>{item.selectedSize}</span>
                                        <span>{item.cost} руб.</span>
                                    </div>
                                </div>
                                <img src={deleteBtn} alt="delete" className={classes.deleteBtn} onClick={() => { setActiveModal(true), setGoodToRemove({ title: item.title, selectedSize: item.selectedSize, selectedColor: item.selectedColor }) }} />
                            </div>
                        ))}
                    </div>
                    <Link style={{ all: 'unset' }} to='/payment'><button className={classes.toPayBtn}>Оплатить: {cartData.reduce((acc, item) => acc + item.cost, 0)} руб.</button></Link>
                </>
            ) : (
                <>
                    <span className={classes.empty}>Корзина пуста</span>
                </>
            )}

            <DeleteModal close={() => setActiveModal(false)} active={activeModal} deleteProduct={() => {
                dispatch(removeFromCart(goodToRemove));
                setActiveModal(false)
            }} header='Удалить товар из корзины?' btn1='Удалить' btn2='Отмена' />
            <DeleteModal close={() => setActiveClearModal(false)} active={activeClearModal} deleteProduct={() => {
                dispatch(clearCart());
                setActiveClearModal(false)
            }} header='Очистить корзину?' btn1='Очистить' btn2='Отмена' />
        </div>
    )
}