import classes from './OrderItem.module.scss'

export default function OrderItem({ order }) {

    let paymentMessage
    let paymentColor
    let orderMessage
    let orderColor

    switch (order.payment_status) {
        case 'NEW':
            paymentMessage = 'Не оплачено'
            paymentColor = '#FF4D4F'
            break
        case 'AUTHORIZED':
            paymentMessage = 'Ожидает подтверждения'
            paymentColor = '#FFA500'
            break
        case 'CONFIRMED':
            paymentMessage = 'Оплачен'
            paymentColor = '#52C41A'
            break
        case 'REJECTED':
            paymentMessage = 'Отклонен'
            paymentColor = '#DC3545'
            break
        default:
            paymentMessage = 'Неизвестный статус'
            paymentColor = '#6C757D'
            break
    }

    switch (order.status) {
        case 'Created':
            orderMessage = 'Создан'
            orderColor = '#6C757D'
            break
        case 'Payed':
            orderMessage = 'Оплачен'
            orderColor = '#FFA500'
            break
        case 'Delivered':
            orderMessage = 'Доставлен'
            orderColor = '#52C41A'
            break
        case 'Finished':
            orderMessage = 'Завершен'
            orderColor = '#469121ff'
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
                <span style={{ color: orderColor }}>Заказ: {orderMessage}</span>
                <span>{order.amount} руб.</span>
                <span style={{ color: paymentColor }}>Платеж: {paymentMessage}</span>
            </div>
        </div>
    )
}