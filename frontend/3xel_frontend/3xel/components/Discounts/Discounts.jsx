import classes from './Discounts.module.scss'

export default function Discounts() {
    return (
        <section className={classes.discountsSection}>
            <h1>Система скидок</h1>
            <div className={classes.discountsSystem}>
                <h2>Мы стараемся, чтобы повторные и парные заказы были выгоднее.</h2>
                <ul className={classes.types}>
                    <li className={classes.type}>
                        <h3>1. Один товар</h3>
                        <span>Обычная цена по прайсу — без дополнительных скидок.</span>
                    </li>
                    <li className={classes.type}>
                        <h3>2. Два и более пластиковых бюста</h3>
                        <span>Со второго пластикового бюста и далее — скидка 500 ₽ на каждый.</span>
                        <span>Например:</span>
                        <ul>
                            <li><span>1 пластиковый бюст — по прайсу</span></li>
                            <li><span>2 пластиковых бюста — прайс + прайс - 500 ₽</span></li>
                            <li><span>3 пластиковых бюста — прайс + (прайс - 500 ₽) + (прайс - 500 ₽)</span></li>
                        </ul>
                    </li>
                    <li className={classes.type}>
                        <h3>3. Набор «пластик + картон»</h3>
                        <span>
                            Если вы берёте картонный бюст в паре с пластиковым,
                            мы считаем картон за 2 500 ₽ вместо стандартных 3 500 ₽ —
                            то есть скидка 1 000 ₽ на каждый картонный бюст в паре.
                        </span>
                    </li>
                    <li className={classes.type}>
                        <h3>4. Повторный заказ по тому же видео</h3>
                        <span>
                            Если мы уже делали для вас бюст по этому видео и вы заказываете ещё:
                            — скидка 1 000 ₽ на каждую позицию в заказе.
                        </span>
                        <span>Эта скидка заменяет все остальные акции и скидки.</span>
                    </li>
                </ul>
                <span className={classes.info}>
                    Скидки применяются автоматически в конструкторе бюстов.
                </span>
            </div>
        </section>
    )
}