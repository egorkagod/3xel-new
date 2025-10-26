import classes from './Order.module.scss'
import { useParams } from 'react-router-dom'
import { fetchOrder } from '../../store/orderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Button from '../Button/Button'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'

export default function Order() {

    const status = useSelector(state => state.order.status)
    const error = useSelector(state => state.order.error)
    const order = useSelector(state => state.order.order)

    const dispatcher = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        dispatcher(fetchOrder({ id }))
    }, [dispatcher, id])

    const renderOrder = () => {
        if (status === 'loading') {
            return <span className={classes.preRender}>Загружаем ваш заказ...</span>
        }

        if (status === 'failed') {
            return <span className={classes.preRender}>{error}</span>
        }

        return (
            <>
                <div className={classes.pageHeader}>
                    <h1>Заказ: {order.id}</h1>
                    <span className={classes.orderStatus}>Статус заказа: <b>{order.status}</b></span>
                </div>
                <div className={classes.items}>
                    {order?.items?.map((item, index) =>
                        <div className={classes.item} key={index}>
                            <img src={item.good_variant.images[0]} alt={item.good_variant.type} />
                            <div className={classes.itemInfo}>
                                <h4>{item.good_variant.type}</h4>
                                <div className={classes.sizeBlock}>
                                    <span className={classes.size}>Размер:</span>
                                    <div className={classes.sizeValue}>{item.good_variant.size} см</div>
                                </div>
                                <div className={classes.colorBlock}>
                                    <span className={classes.color}>Цвет:</span>
                                    <div style={{ borderRadius: '50%', width: '24px', height: '24px', background: item.good_variant.color }}></div>
                                </div>
                                <span className={classes.cost}>{item.good_variant.cost} ₽</span>
                                <HashLink style={{ all: 'unset' }} to='/constructor#goods'>
                                    <Button color='golden'>К товарам</Button>
                                </HashLink>
                            </div>
                        </div>
                    )}
                </div>
                <div className={classes.orderResult}>
                    <div className={classes.costAmount}>
                        <strong>Итоговая стоимость:</strong>
                        <span className={classes.result}>{order.amount} ₽</span>
                    </div>
                    <span className={classes.itemsAmount}>Количество товаров: <b>{order?.items?.length}</b></span>
                    <div className={classes.buttons}>
                        <Link style={{ all: 'unset' }} to='/profile'>
                            <Button color='white'>Назад</Button>
                        </Link>
                        {order.status === 'complete' ? (
                            <Button color='golden'>Повторить заказ</Button>
                        ) : null}
                    </div>
                </div>
            </>
        )
    }

    return (
        <main className={classes.order}>
            {renderOrder()}
        </main>
    )
}