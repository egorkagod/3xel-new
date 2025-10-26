import classes from './Instruction.module.scss'
import clearCam from '/3xel_images/clear_cam.png'
import light from '/3xel_images/light.jpg'
import options from '/3xel_images/options.jpg'
import place from '/3xel_images/place.jpg'
import reflections from '/3xel_images/reflections.jpg'
import steps from '/3xel_images/steps.png'
import instruction from '/3xel_images/instruction.gif'

export default function Instruction() {
    return (
        <main className={classes.instruction}>
            <div className={classes.pageHeader}>
                <h1>Инструкция для съемки видео (3xel)</h1>
                <span className={classes.subTitle}>Быстрый чек-лист</span>
            </div>

            <section className={classes.instructionSection}>
                <p className={classes.leftSide}>1. <b>Протрите объективы</b> — меньше бликов и размытия.</p>
                <img src={clearCam} alt="clear camera photo" />
            </section>
            <section className={classes.instructionSection}>
                <p className={classes.leftSide}>
                    2. <b>Разрешение и FPS</b> — идеально <b>4K при 60 к/c.</b><br />
                    Если нет 4K 60 к/с: <b>30/25/24</b> или <b>1080p при 60 к/с</b> или <b>1080p при 30/25/24.</b>
                </p>
                <img src={options} alt="camera options photo" />
            </section>
            <section className={classes.instructionSection}>
                <p className={classes.leftSide}>
                    3. <b>Без отражений</b><br />
                    Избегайте глянцевых полов/стен (мрамор/металл), стеклянных витрин и зеркал.
                </p>
                <img src={reflections} alt="reflections photo" />
            </section>
            <section className={classes.instructionSection}>
                <p className={classes.leftSide}>
                    4. <b>Равномерный свет</b><br />
                    Подсветка с нескольких сторон —<br />
                    не светите только с одной стороны, избегайте жёстких теней.

                </p>
                <img src={light} alt="light photo" />
            </section>
            <section className={classes.instructionSection}>
                <p className={classes.leftSide}>
                    5. <b>Достаточно места</b><br />
                    Оставьте запас, чтобы объект целиком помещался в кадре и не выпадал из него.
                </p>
                <img src={place} alt="placement photo" />
            </section>
            <section className={classes.instructionSection}>
                <div className={classes.leftSide}>
                    <h2>Как снимать (без остановок, без пауз, всего 1-2 минуты)</h2>
                    <ul>
                        <li>
                            Запишите <b>одно непрерывное видео</b>. Сделайте <b>четыре полных круга</b> вокруг объекта <b>без остановок и без зума</b>.
                        </li>
                        <li>
                            Держите объект по центру кадра и примерно на одинаковом расстоянии; двигайтесь плавно.
                        </li>
                    </ul>
                </div>
                <img src={instruction} alt="instruction gif" />
            </section>
            <section className={classes.instructionSection}>
                <div className={classes.leftSide}>
                    <p>
                        <span>Круг 1 — Низкий ракурс</span>
                        <span>
                            Обходите на максимально низком уровне,
                            чтобы захватить нижние детали.
                        </span>
                    </p>
                    <p>
                        <span>Круг 2 — На уровне глаз / прямо</span>
                        <span>
                            Поднимите камеру до среднего уровня и
                            сделайте второй круг.
                        </span>
                    </p>
                    <p>
                        <span>Круг 3 — Примерно под 30° сверху</span>
                        <span>
                            Поднимите ракурс до ~30° и обойдите ещё раз,
                            чтобы покрыть верхние плоскости.
                        </span>
                    </p>
                    <p>
                        <span>Круг 4 — Высокий ракурс (45–60°)</span>
                        <span>
                            Завершите высоким углом (почти сверху),
                            чтобы добрать все зоны.
                        </span>
                    </p>
                </div>
                <img src={steps} alt="video steps" />
            </section>
        </main>
    )
}