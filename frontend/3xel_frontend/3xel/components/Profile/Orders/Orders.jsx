import classes from './Orders.module.scss'

export default function Orders() {
    return (
        <div className={classes.globalContainer}>
            <div className={classes.activeOrders}>
                <span className={classes.header}>Активные заказы: 0</span>
                <div>
                    <span className={classes.empty}>Активных нет</span>
                </div>
            </div>

            <div className={classes.pastOrders}>
                <span className={classes.header}>Прошлые заказы</span>
                <div>
                    <span className={classes.empty}>Прошлых нет</span>
                </div>
            </div>
        </div>
    )
}