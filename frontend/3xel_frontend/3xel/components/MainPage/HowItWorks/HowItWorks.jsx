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
                    Вы снимаете короткое видео человека по простым <Link style={{ color: '#6e6a65' }} to='/instruction'>инструкциям</Link> и загружаете его через форму на сайте.
                </Step>
                <Step header='2. Создание 3D-модели'>
                    По видео мы строим 3D-модель головы и плеч, вручную правим черты лица, убираем артефакты и готовим модель к производству.
                </Step>
                <Step header='3. Изготовление бюста'>
                    — Для пластика: печать на 3D-принтере. <br />
                    — Для картона: нарезка слоёв, разработка индивидуальной инструкции и комплектация набора. <br />
                    Срок изготовления от 3 до 5 рабочих дней. <br />
                    <span style={{ color: 'rgb(181, 3, 3)' }}>Срок доставки указывается без учета срока изготовления изделия!</span>
                </Step>
                <Step header='4. Отправка покупателю'>
                    Упаковываем в подарочную коробку и отправляем службой доставки. Внутри — бюст/конструктор и инструкция по сборке.
                </Step>
            </div>
        </section>
    )
}