import { useState, forwardRef } from 'react'
import classes from './Cart.module.scss'
import classNames from 'classnames'
import closeBtn from '../../../public/images/close-btn.png'
import deleteBtn from '/images/cart-delete-btn.png'
import DeleteModal from './DeleteModal/DeleteModal'
import { useDispatch } from 'react-redux'
import { removeFromCart, clearCart } from '../../store/cartSlice'
import { Link } from 'react-router-dom'

const Cart = forwardRef(({ isActive, cartData, onClick, toPay }, ref) => {
    const [activeModal, setActiveModal] = useState(false)
    const [activeClearModal, setActiveClearModal] = useState(false)
    const [goodToRemove, setGoodToRemove] = useState()
    const dispatch = useDispatch()

    return (
        <div ref={ref} className={classNames(classes.globalContainer, { [classes.active]: isActive })}>
            <button className={classes.closeBtn}>
                <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" width='30' height='30'>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

            </button>
            {cartData.length > 0 ? (
                <>
                    <button className={classes.clearBtn} onClick={() => setActiveClearModal(true)}>
                        Очистить
                    </button>
                    <div className={classes.itemContainer}>
                        {cartData.map((item) => (
                            <div key={item.id} className={classes.cartItem}>
                                <div className={classes.productImage} style={{ backgroundImage: `url(${item.background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderRadius: '16px' }}></div>
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
                                <svg className={classes.deleteBtn} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width='30' height='30' stroke="currentColor" onClick={() => {
                                    setActiveModal(true)
                                    setGoodToRemove({
                                        title: item.title,
                                        selectedSize: item.selectedSize,
                                        selectedColor: item.selectedColor,
                                    })
                                }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                        ))}
                    </div>
                    <Link style={{ all: 'unset' }} to='/payment' onClick={toPay}>
                        <button className={classes.toPayBtn}>
                            Оплатить: {cartData.reduce((acc, item) => acc + item.cost, 0)} руб.
                        </button>
                    </Link>
                </>
            ) : (
                <span className={classes.empty}>Корзина пуста</span>
            )}

            <DeleteModal
                close={() => setActiveModal(false)}
                active={activeModal}
                deleteProduct={() => {
                    dispatch(removeFromCart(goodToRemove))
                    setActiveModal(false)
                }}
                header='Удалить товар из корзины?'
                btn1='Удалить'
                btn2='Отмена'
            />
            <DeleteModal
                close={() => setActiveClearModal(false)}
                active={activeClearModal}
                deleteProduct={() => {
                    dispatch(clearCart())
                    setActiveClearModal(false)
                }}
                header='Очистить корзину?'
                btn1='Очистить'
                btn2='Отмена'
            />
        </div>
    )
})

export default Cart
