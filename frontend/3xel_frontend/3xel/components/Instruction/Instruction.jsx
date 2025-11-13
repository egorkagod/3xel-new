import classes from './Instruction.module.scss'
import clearCam from '/3xel_images/clear_cam.png'
import light from '/3xel_images/light.jpg'
import options from '/3xel_images/options.jpg'
import place from '/3xel_images/place.jpg'
import reflections from '/3xel_images/reflections.jpg'
import steps from '/3xel_images/steps.png'
import instruction from '/3xel_images/instruction.gif'
import Point from './Point/Point'

export default function Instruction() {
    return (
        <main className={classes.instruction}>
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
        </main>
    )
}