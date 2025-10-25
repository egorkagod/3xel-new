import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import classes from './ProfileBlock.module.scss'
import Button from '../../Button/Button'
import { logoutUser } from '../../../store/userSlice'
import { fetchOrders } from '../../../store/ordersSlice'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export default function ProfileBlock({
  onClose,
  onSwitchToReset,
}) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
  const orders = useSelector((state) => state.orders.items)
  const ordersStatus = useSelector((state) => state.orders.status)
  const logoutStatus = useSelector((state) => state.user.logoutStatus)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.info('Вы вышли из аккаунта')
      onClose()
    } catch (error) {
      toast.error(error)
    }
  }

  const renderOrders = () => {
    if (ordersStatus === 'loading') {
      return <span>Загружаем ваши заказы...</span>
    }

    if (!orders || orders.length === 0) {
      return (
        <span>
          У вас пока нет заказов. Загляните в каталог, чтобы оформить
          первый!
        </span>
      )
    }

    return (
      <div className={classes.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={classes.orderCard}>
            <div className={classes.orderHeader}>
              <span className={classes.orderId}>
                Заказ #{order.id.slice(0, 8)}
              </span>
              <span className={classes.orderStatus}>
                {order.status}
              </span>
            </div>
            <div className={classes.orderRow}>
              <span>Сумма</span>
              <strong>{currencyFormatter.format(order.amount)}</strong>
            </div>
            <div className={classes.orderRow}>
              <span>Создан</span>
              <span>{order.created_at}</span>
            </div>
            <div className={classes.orderRow}>
              <span>Оплата</span>
              <span>{order.payment_status}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={classes.profileBlock}>
      <div className={classes.header}>
        <div>
          <h4>Личный кабинет</h4>
          <span className={classes.subtitle}>
            Управляйте своими данными и отслеживайте заказы
          </span>
        </div>
        <Button color="white" onClick={onClose}>
          Закрыть
        </Button>
      </div>

      <div className={classes.content}>
        <section className={classes.card}>
          <h5>Ваши данные</h5>
          <div className={classes.infoRow}>
            <span>Имя</span>
            <strong>{user?.first_name || 'Пусто'}</strong>
          </div>
          <div className={classes.infoRow}>
            <span>E-mail</span>
            <strong>{user?.email}</strong>
          </div>

          {/* Форма смены имени скрыта согласно требованиям */}

          <div className={classes.actions}>
            <Button color="white" onClick={onSwitchToReset}>
              Сменить пароль
            </Button>
            <Button
              color="white"
              disabled={logoutStatus === 'loading'}
              onClick={handleLogout}
            >
              {logoutStatus === 'loading'
                ? 'Выходим...'
                : 'Выйти из аккаунта'}
            </Button>
          </div>
        </section>

        <section className={classes.card}>
          <h5>История заказов</h5>
          {renderOrders()}
        </section>
      </div>
    </div>
  )
}
