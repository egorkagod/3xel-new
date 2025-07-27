import classes from './OrderItem.module.scss'
import { useNavigate } from 'react-router'

export default function OrderItem({ order }) {

    const navigate = useNavigate()

    let orderMessage
    let orderColor

    const status = {
        order: order.status,
        payment: order.payment_status
    }

    if (status.order === 'Delivered') {
        orderMessage = 'Доставлен'
        orderColor = '#52C41A'
    } else if (status.order === 'Finished') {
        orderMessage = 'Завершен'
        orderColor = '#469121'
    } else if (status.payment === 'NEW') {
        orderMessage = 'Создан'
        orderColor = '#6C757D'
    } else if (status.payment === 'AUTHORIZED') {
        orderMessage = 'Ожидает подтверждения'
        orderColor = '#FFA500'
    } else if (status.payment === 'CONFIRMED') {
        orderMessage = 'Оплачен'
        orderColor = '#52C41A'
    } else if (status.payment === 'REJECTED') {
        orderMessage = 'Отклонен'
        orderColor = '#DC3545'
    } else {
        orderMessage = 'Неизвестный статус'
        orderColor = '#6C757D'
    }



    return (
        <div className={classes.globalContainer} onClick={() => navigate(`/order/${order.id}`)}>
            <div className={classes.header}>
                <span>Время создания заказа: {order.created_at}</span>
            </div>
            <div className={classes.main}>
                <span>Заказ: <span style={{ color: orderColor }}>{orderMessage}</span></span>
                <span>{order.amount} руб.</span>
            </div>
        </div>
    )
}