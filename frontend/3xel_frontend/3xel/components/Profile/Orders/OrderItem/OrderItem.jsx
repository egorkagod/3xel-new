import classes from './OrderItem.module.scss'
import { useNavigate } from 'react-router'

export default function OrderItem({ order }) {

    const navigate = useNavigate()

    let orderMessage
    let orderColor
    let paymentMessage
    let paymentColor

    switch (order.status) {
        case 'Создан': 
            orderMessage = 'Создан'
            orderColor = '#6C757D'
            break
        case 'В обработке':
            orderMessage = 'В обработке'
            orderColor = '#FFA500'
            break
        case 'Отправлен': 
            orderMessage = 'Отправлен'
            orderColor = '#52C41A'
            break
        case 'Доставлен': 
            orderMessage = 'Доставлен'
            orderColor = '#52C41A'
            break
        case 'Отменен':
            orderMessage = 'Отменен'
            orderColor = '#DC3545'
            break
        case 'Возврат': 
            orderMessage = 'Возврат'
            orderColor = '#DC3545'
            break
        case 'Завершен': 
            orderMessage = 'Завершен'
            orderColor = '#2d6810ff'
            break
    }

    switch (order.payment_status) {
        case 'Ожидает подтверждения':
            paymentMessage = 'Ожидает подтверждения'
            paymentColor = '#FFA500'
            break
        case 'Оплачено': 
            paymentMessage = 'Оплачено'
            paymentColor = '#52C41A'
            break
        case 'Частично отменена':
            paymentMessage = 'Частично отменена'
            paymentColor = '#FFA500'
            break
        case 'Отменена после холдирования':
            paymentMessage = 'Отменена после удержания'
            paymentColor = '#FFA500'
            break
        case 'Отменена по ссылке':
            paymentMessage = 'Отменена по ссылке'
            paymentColor = '#DC3545'
            break
        case 'Частичный возврат':
            paymentMessage = 'Частичный возврат'
            paymentColor = '#FFA500'
            break
        case 'Полный возврат': 
            paymentMessage = 'Полный возврат'
            paymentColor = '#DC3545'
            break
        case 'Ошибка списания':
            paymentMessage = 'Ошибка списания'
            paymentColor = '#DC3545'
            break
        case 'Истек срок ожидания 3DS':
            paymentMessage = 'Истёк срок ожидания 3DS'
            paymentColor = '#DC3545'
            break
    }

    return (
        <div className={classes.globalContainer}>
            <div className={classes.header}>
                <span>Время создания заказа: {order.created_at}</span>
            </div>
            <div className={classes.main}>
                <span>Заказ: <span style={{ color: orderColor }}>{orderMessage}</span></span>
                <span>Оплата: <span style={{ color: paymentColor }}>{paymentMessage}</span></span>
                <span>Сумма: {order.amount} руб.</span>
            </div>
        </div>
    )
}