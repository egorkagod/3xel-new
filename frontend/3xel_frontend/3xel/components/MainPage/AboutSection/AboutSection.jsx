import classes from './AboutSection.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'

export default function AboutSection() {
    return (
        <section className={classes.aboutSection}>
            <SectionHeader header='О 3xel'>
                Технологии и ремесло ради памяти.
            </SectionHeader>

            <div className={classes.contentContainer}>
                <div className={classes.infoBlock}>
                    <p>3xel — про важные моменты и людей.</p>
                </div>
                <div className={classes.infoBlock}>
                    <p>E‑mail: hello@3xel.ru · Telegram: @three_xel</p>
                </div>
            </div>
        </section>
    )
}