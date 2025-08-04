import classes from './Orders.module.scss'
import OrderItem from './OrderItem/OrderItem'
import { useEffect, useState } from 'react'
import { getCookie } from '../../../utils/cookie'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateActiveOrders, updatePastOrders } from '../../store/ordersSlice'
import Loader from '../../Loader/Loader'

export default function Orders() {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const csrfToken = getCookie('csrftoken')
    const dispatcher = useDispatch()

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true)
                const response = await fetch('/api-order/orders', {
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
                dispatcher(updateActiveOrders(data))
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
                <div className={classes.empty} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Loader color={'black'}></Loader>
                    <span>Список заказов загружается...</span>
                </div>
                
            ) : (
                data.length === 0 ? (<>
                    <div className={classes.activeOrders}>
                        <span className={classes.header}>Активные заказы: {data.length}</span>
                        <span style={{ justifySelf: 'center' }}>Активных нет</span>
                    </div>

                    <div className={classes.pastOrders}>
                        <span className={classes.header}>Прошлые заказы</span>
                        <span style={{ justifySelf: 'center' }}>Прошлых нет</span>
                    </div>
                </>) : (
                    <>
                        <div className={classes.activeOrders}>
                            <span className={classes.header}>Активные заказы: {data.length}</span>
                            {data.map((order) => <OrderItem order={order} key={order.id}></OrderItem>)}
                        </div>

                        <div className={classes.pastOrders}>
                            <span className={classes.header}>Прошлые заказы</span>
                            <span style={{ justifySelf: 'center' }}>Прошлых нет</span>
                        </div>
                    </>
                )
            )}
        </div>
    )
}