import classes from './MainUpperSection.module.scss'
import Button from '../../Button/Button'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'

export default function MainUpperSection() {

    const slides = [
        '/images/carusel/1.png',
        '/images/carusel/2.png',
        '/images/carusel/3.png',
        '/images/carusel/4.png',
        '/images/carusel/5.png',
    ]

    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <section className={classes.upperSection}>
            <div className={classes.leftSide}>
                {slides.map(slide => <img src={slide} className={classNames(classes.slide, { [classes.active]: slide === slides[currentSlide] })} alt='Картинка клиента с бюстом' loading='lazy' />)}
            </div>
            <div className={classes.rightSide}>
                <span className={classes.sectionHeader}>
                    Персональный бюст по вашему видео
                </span>
                <span className={classes.subText}>
                    Создаём уникальный памятный сувенир: превращаем ваше короткое видео в реалистичный бюст. Изделие изготавливается из пластика или картона по индивидуальной 3D‑модели с тщательной ручной доработкой. Мы позаботились о том, чтобы сборка была лёгкой: в комплекте — понятная инструкция шаг за шагом.
                </span>
                <div className={classes.buttonsContainer}>
                    <Link style={{ all: 'unset' }} to='/constructor'>
                        <Button color='golden'>Заказать бюст</Button>
                    </Link>
                    <HashLink style={{ all: 'unset' }} smooth to='/#certificates'>
                        <Button color='white'>Купить сертификат</Button>
                    </HashLink>
                </div>
            </div>
        </section>
    )
}