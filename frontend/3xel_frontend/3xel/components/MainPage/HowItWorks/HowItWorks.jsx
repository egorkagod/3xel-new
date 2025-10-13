import classes from './HowItWorks.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'
import Step from './Step/Step'

export default function HowItWorks() {
    return (
        <section className={classes.howItWorksSection}>
            <SectionHeader header='Как это работает'>
                От идеи до подарка — спокойно и понятно.
            </SectionHeader>
            <div className={classes.stepsContainer}>
                <Step header='1. Заявка'>
                    Вы выбираете продукт и загружаете материалы.
                </Step>
                <Step header='2. Подготовка модели'>
                    Формируем объём, настраиваем материал и размер.
                </Step>
                <Step header='3. Производство'>
                    Сборка картонных слоёв или 3D‑печать и пост‑обработка.
                </Step>
                <Step header='4. Упаковка и доставка'>
                    Дарочная коробка и отслеживание.
                </Step>
            </div>
        </section>
    )
}