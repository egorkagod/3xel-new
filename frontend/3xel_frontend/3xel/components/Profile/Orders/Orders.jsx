import classes from './Orders.module.scss'
import OrderItem from './OrderItem/OrderItem'
import { useEffect, useState } from 'react'
import { getCookie } from '../../../utils/cookie'
import { toast } from 'react-toastify'

export default function Orders() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const csrfToken = getCookie('csrftoken')

    useEffect(() => {

        async function fetchData() {
            try {
                setIsLoading(true)
                const response = await fetch('api', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                })

                if (!response.ok) throw new Error()

                const data = await response.json()
                setData(data)
            } catch {
                toast.error('Не удалось загрузить список заказов')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()

    }, [])

    return (
        <div className={classes.globalContainer}>
            {isLoading ? (
                <span className={classes.empty}>Список заказов загружается...</span>
            ) : (
                data ? (<span className={classes.empty}></span>) : (
                    <>
                        <div className={classes.activeOrders}>
                            <span className={classes.header}>Активные заказы: {data.length}</span>
                            <div className={classes.ordersList}>
                                {data.map((order) => <OrderItem order={order} key={order.id}></OrderItem>)}
                            </div>
                        </div>

                        <div className={classes.pastOrders}>
                            <span className={classes.header}>Прошлые заказы</span>
                            <div>
                                <span className={classes.empty}>Прошлых нет</span>
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    )
}