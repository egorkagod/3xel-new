import classes from './Constructor.module.scss'
import SelectGood from './SelectGood/SelectGood'
import Cart from './Cart/Cart'
import OrderForm from './OrderForm/OrderForm'
import Reminder from './Reminder/Reminder'

export default function Constructor() {
    return (
        <main className={classes.constructorPage}>
            <h1>Конструктор бюстов</h1>
            <p className={classes.subTitle}>Выберите конфигурацию и укажите данные для доставки.</p>
            <Reminder></Reminder>
            <SelectGood></SelectGood>
            <Cart></Cart>
            <OrderForm></OrderForm>
        </main>
    )
}