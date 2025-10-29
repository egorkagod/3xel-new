import Button from '../../Button/Button'
import classes from './Cart.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart } from '../../../store/cartSlice'
import { HashLink } from 'react-router-hash-link'
import { useState } from 'react'

export default function Cart() {

    const cart = useSelector(state => state.cart.items)
    const dispatcher = useDispatch()
    const [showDiscountInfo, setShowDiscountInfo] = useState(false)

    return (
        <section className={classes.cartSection}>
            <h2>2. Выбранные позиции</h2>
            <div className={classes.cart}>
                {cart.length > 0 ? (
                    cart.map((item, index) =>
                        <div>
                            {item.name === 'Подарочный сертификат' ? (
                                <div className={classes.addedCertificate} key={index}>
                                    <span className={classes.itemDescription}>{item.name} — {item.cost} ₽</span>
                                    <Button color='white' onClick={() => dispatcher(removeFromCart(index))}>Удалить</Button>
                                </div>
                            ) : (
                                <div className={classes.addedBust}>
                                    <div className={classes.itemDescription} key={index}>
                                        <span>{item.name} — {item.size}, цвет: <span style={{ borderRadius: '50%', width: '24px', height: '24px', background: item.color, border: '1px solid black' }}></span> </span>
                                        {item.discount === 0 ? (
                                            <span className={classes.cost}>Цена: {item.cost} ₽ (скидка 0 ₽)</span>
                                        ) : (
                                            <span className={classes.cost}>Цена: <s>{item.cost} ₽</s> → <b>{item.cost - item.discount} ₽</b> (скидка {item.discount} ₽)</span>
                                        )}
                                    </div>
                                    <div className={classes.buttonsBlock}>
                                        <Button color='white' onClick={() => dispatcher(removeFromCart(index))}>Удалить</Button>
                                        {item.discount === 0 ? 
                                        <HashLink style={{ all: 'unset' }} to='/constructor#goods'><Button color='golden'>Добавить товары со скидкой</Button></HashLink> : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <p>Пока пусто. Добавьте изделия, воспользовавшись конструктором выше.</p>
                )}
            </div>
        </section>
    )
}