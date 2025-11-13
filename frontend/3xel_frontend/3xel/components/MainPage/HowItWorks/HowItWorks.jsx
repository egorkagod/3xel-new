import classes from './HowItWorks.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'
import Step from './Step/Step'
import { Link } from 'react-router-dom'

export default function HowItWorks() {
    return (
        <section className={classes.howItWorksSection} id='process'>
            <SectionHeader header='Как это работает'>
                Как из видео появляется бюст.
            </SectionHeader>
            <div className={classes.stepsContainer}>
                <Step header='1. Оформление заказа'>
                    Снимаете короткое видео человека по простым <Link style={{ color: '#6e6a65' }} to='/instruction'>инструкциям</Link> и загружаете его через форму на сайте.
                </Step>
                <Step header='2. Мы создаём 3D-модель'>
                    По видео строим 3D-модель головы и плеч, вручную правим черты лица, убираем артефакты и готовим модель к производству.
                </Step>
                <Step header='3. Изготавливаем бюст'>
                    — Для пластика: печать на 3D-принтере. <br />
                    — Для картона: нарезка слоёв, разработка индивидуальной инструкции и комплектация набора.
                </Step>
                <Step header='4. Отправляем вам'>
                    Упаковываем в подарочную коробку и отправляем службой доставки. Внутри — бюст/конструктор и инструкция по сборке.
                </Step>
            </div>
        </section>
    )
}