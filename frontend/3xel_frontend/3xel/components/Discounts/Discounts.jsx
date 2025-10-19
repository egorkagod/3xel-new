import classes from './Discounts.module.scss'

export default function Discounts() {
    return (
        <section className={classes.discountsSection}>
            <h1>Система скидок</h1>
            <div className={classes.discountsSystem}>
                <ul>
                    <li>
                        <strong>Один товар</strong> — цена по прайсу.
                    </li>
                    <li>
                        <strong>Два и более пластиковых бюста</strong>: со второго и далее <strong>-500 ₽</strong> за штуку.
                    </li>
                    <li>
                        <strong>Пластик + картон</strong>: картон считаем <strong>2 500 ₽</strong> в паре с каждым пластиковым бюстом (скидка 1000 ₽).
                    </li>
                    <li>
                        <strong>Повторный заказ</strong>: <strong>-1000 ₽</strong> на каждую позицию (заменяет другие акции).
                    </li>
                </ul>
                <span>
                    Скидки применяются автоматически в конструкторе бюстов.
                </span>
            </div>
        </section>
    )
}