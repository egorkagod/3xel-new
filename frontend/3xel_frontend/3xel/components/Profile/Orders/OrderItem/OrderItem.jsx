import classes from './OrderItem.module.scss'

export default function OrderItem({ order }) {
    return (
        <div className={classes.globalContainer}>
            <div className={classes.header}>
                <span>Время создания заказа: {order.created_at}</span>
            </div>
            <div className={classes.main}>
                <span>{order.status}</span>
                <span>{order.amount} руб.</span>
                <span>{order.payment_status}</span>
            </div>
        </div>
    )
}