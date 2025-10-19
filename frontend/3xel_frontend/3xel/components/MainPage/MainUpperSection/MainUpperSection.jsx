import classes from './MainUpperSection.module.scss'
import image1 from '../../../assets/carusel_image1.png'
import image2 from '../../../assets/carusel_image2.png'
import image3 from '../../../assets/carusel_image3.png'
import image4 from '../../../assets/carusel_image4.png'
import Button from '../../Button/Button'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'

export default function MainUpperSection() {

    const slides = [
        image1,
        image2,
        image3,
        image4,
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
                {slides.map(slide => <img src={slide} className={classNames(classes.slide, { [classes.active]: slide === slides[currentSlide] })} alt='Картинка клиента с бюстом' />)}
            </div>
            <div className={classes.rightSide}>
                <span className={classes.supText}>Подарок, который помнят</span>
                <span className={classes.sectionHeader}>
                    Создаём персональные бюсты и дарим эмоции близким
                </span>
                <span className={classes.subText}>
                    Картонный конструктор, пластиковый премиум и подарочные сертификаты с включённой доставкой.
                </span>
                <div className={classes.buttonsContainer}>
                    <Link style={{ all: 'unset' }} to='/constructor'>
                        <Button color='golden'>Открыть конструктор</Button>
                    </Link>
                    <HashLink style={{ all: 'unset' }} smooth to='/#certificates'>
                        <Button color='white'>Купить сертификат</Button>
                    </HashLink>
                </div>
            </div>
        </section>
    )
}