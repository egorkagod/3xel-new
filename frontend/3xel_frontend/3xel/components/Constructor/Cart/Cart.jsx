import Button from '../../Button/Button'
import classes from './Cart.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart } from '../../../store/cartSlice'

export default function Cart() {

    const cart = useSelector(state => state.cart)
    const dispatcher = useDispatch()

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
                                        <span>{item.name} — {item.size}, цвет: {item.colorName} <span>({item.color})</span></span>
                                        <span className={classes.cost}>Цена: {item.cost} ₽ (скидка 0 ₽)</span>
                                    </div>
                                    <Button color='white' onClick={() => dispatcher(removeFromCart(index))}>Удалить</Button>
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