import classes from './Instruction.module.scss'
import clearCam from '/3xel_images/clear_cam.png'
import light from '/3xel_images/light.jpg'
import options from '/3xel_images/options.jpg'
import place from '/3xel_images/place.jpg'
import reflections from '/3xel_images/reflections.jpg'
import steps from '/3xel_images/steps.png'
import instruction from '/3xel_images/instruction.gif'
import Point from './Point/Point'
import well from '/videos/well.mp4'
import bad from '/videos/bad.mp4'

export default function Instruction() {
    return (
        <main className={classes.instructions}>
            <div className={classes.title}>
                <h1>Инструкция для съёмки видео</h1>
                <span className={classes.subtitle}>Короткий чек-лист и пошаговая схема, чтобы видео для бюста получилось с первого раза.</span>
            </div>
            <section className={classes.recomendations}>
                <h2>Быстрый чек-лист перед съёмкой</h2>
                <Point number={1} header='Протрите объективы.' img={clearCam} alt='Чистый объектив камеры'>
                    Салфеткой или мягкой тканью — меньше бликов и размытия.
                </Point>
                <Point number={2} header='Поставьте правильное качество.' img={options} alt='Настройка 4K/60FPS'>
                    Идеально — <strong>4K 60 к/с</strong>. Если нет, выберите 4K 30/25/24 или 1080p 60/30 к/с.
                </Point>
                <Point number={3} header='Без лишних отражений' img={reflections} alt='Пример плохих отражений'>
                    Не снимайте рядом с глянцевыми полами, витринами и зеркалами.
                </Point>
                <Point number={4} header='Сделайте ровный свет.' img={light} alt='Правильное освещение'>
                    Подсветите с нескольких сторон, не оставляйте половину объекта в тени.
                </Point>
                <Point number={5} header='Оставьте запас по краям кадра.' img={place} alt='Достаточно места вокруг объекта'>
                    Объект целиком в кадре, ничего не «обрезается» сверху и снизу.
                </Point>
            </section>
            <section className={classes.instruction}>
                <h2>Как снимать видео (1–2 минуты, без пауз)</h2>
                <div className={classes.instructionContent}>
                    <ul style={{ padding: '20px' }}>
                        <li>
                            <span className={classes.instructionPoint}>Запишите <strong>одно непрерывное видео</strong> без остановок.</span>
                        </li>
                        <li>
                            <span className={classes.instructionPoint}>Сделайте <strong>4 полных круга</strong> вокруг объекта без зума.</span>
                        </li>
                        <li>
                            <span className={classes.instructionPoint}>Держите объект по центру кадра на одинаковом расстоянии.</span>
                        </li>
                        <li>
                            <span className={classes.instructionPoint}>Двигайтесь плавно, без резких рывков и поворотов камеры.</span>
                        </li>
                    </ul>
                    <img src={instruction} alt="Человек обходит объект по кругу" />
                </div>
            </section>
            <section className={classes.fourCircles}>
                <h2>Четыре круга вокруг объекта</h2>
                <div className={classes.steps}>
                    <div className={classes.step}>
                        <h4>Круг 1 — низкий ракурс</h4>
                        <span className={classes.text}>
                            Обходите на максимально низком уровне, чтобы захватить нижние детали.
                        </span>
                    </div>
                    <div className={classes.step}>
                        <h4>Круг 2 — на уровне глаз</h4>
                        <span className={classes.text}>
                            Поднимите камеру до уровня глаз и сделайте второй круг.
                        </span>
                    </div>
                    <div className={classes.step}>
                        <h4>Круг 3 — ~30° сверху</h4>
                        <span className={classes.text}>
                            Поднимите камеру чуть выше и обойдите объект ещё раз, добирая верхние плоскости.
                        </span>
                    </div>
                    <div className={classes.step}>
                        <h4>Круг 4 — высокий ракурс 45–60°</h4>
                        <span className={classes.text}>
                            Завершите съёмку почти сверху, чтобы покрыть все оставшиеся зоны.
                        </span>
                    </div>
                </div>
                <img src={steps} alt="Схема: четыре круга вокруг бюста" />
            </section>
            <section className={classes.examples}>
                <div className={classes.examplesTitle}>
                    <h2>Примеры видео</h2>
                    <span className={classes.subtitle}>Ниже — как должно выглядеть видео для бюста и пример, как снимать не нужно.</span>
                </div>
                <div className={classes.videoBlock}>
                    <div className={classes.leftSide}>
                        <div className={classes.videoTitle}>
                            <h4>Хороший пример</h4>
                            <span className={classes.subtitle}>Ровный свет, без резких движений, 4 круга вокруг человека.</span>
                        </div>
                        <video src={well} controls muted></video>
                    </div>
                    <div className={classes.rightSide}>
                        <div className={classes.videoTitle}>
                            <h4 style={{ color: '#c84646' }}>Плохой пример</h4>
                            <span className={classes.subtitle}>Темно, сильные тени, резкие движения, человек выходит из кадра.</span>
                        </div>
                        <video src={bad} controls muted></video>
                    </div>
                </div>
            </section>
        </main>
    )
}