import classes from './Instruction.module.scss'
import clearCam from '/3xel_images/clear_cam.png'
import light from '/3xel_images/light.jpg'
import options from '/3xel_images/options.jpg'
import place from '/3xel_images/place.jpg'
import reflections from '/3xel_images/reflections.jpg'
import steps from '/3xel_images/steps.jpg'

export default function Instruction() {
    return (
        <main className={classes.instruction}>
            <div className={classes.pageHeader}>
                <h1>Инструкция для съемки видео (3xel)</h1>
                <span>Быстрый чек-лист</span>
            </div>

            <section className={classes.instructionSection}>
                <span>1. <b>Протрите объективы</b> — меньше бликов и размытия.</span>
                <img src={clearCam} alt="clear camera photo" />
            </section>
            <section className={classes.instructionSection}>
                <span>2. </span>
                <img src="" alt="" />
            </section>
            <section className={classes.instructionSection}>
                <span></span>
                <img src="" alt="" />
            </section>
            <section className={classes.instructionSection}>
                <span></span>
                <img src="" alt="" />
            </section>
            <section className={classes.instructionSection}>
                <span></span>
                <img src="" alt="" />
            </section>
            <section className={classes.instructionSection}>
                <span></span>
                <img src="" alt="" />
            </section>
            <section className={classes.instructionSection}>
                <span></span>
                <img src="" alt="" />
            </section>
        </main>
    )
}