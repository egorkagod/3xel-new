import classes from './OrderItem.module.scss'

export default function OrderItem({ order }) {


    let orderMessage
    let orderColor

    const status = {
        order: order.status,
        payment: order.payment_status
    }

    switch (status) {
        case (status.order === 'Delivered'): 
            orderMessage = 'Доставлен'
            orderColor = '#52C41A'
            break
        case (status.order === 'Finished'):
            orderMessage = 'Завершен'
            orderColor = '#469121ff'
        case (status.payment === 'NEW'):
            orderMessage = 'Создан'
            orderColor = '#6C757D'
            break
        case (status.payment === 'AUTHORIZED'):
            orderMessage = 'Ожидает подтверждения'
            orderColor = '#FFA500'
            break
        case (status.payment === 'CONFIRMED'):
            orderMessage = 'Оплачен'
            orderColor = '#52C41A'
            break
        case (status.payment === 'REJECTED'):
            orderMessage = 'Отклонен'
            orderColor = '#DC3545'
            break
        default:
            orderMessage = 'Неизвестный статус'
            orderColor = '#6C757D'
            break
    }

    

    return (
        <div className={classes.globalContainer}>
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