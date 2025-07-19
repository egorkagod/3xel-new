import classes from './Slider.module.scss'
import slide1 from '../../../../public/images/slide1.jpg'
import slide2 from '../../../../public/images/slide2.jpg'
import sliderArrow from '../../../../public/images/slider-arrow.png'
import { useState } from 'react'
import classNames from 'classnames'


export default function Slider() {
    const [activeSlide, setActiveSlide] = useState(0)

    const slides = [
        slide1, slide2
    ]

    const toNext = () => {
        if (activeSlide === slides.length - 1) {
            setActiveSlide(0)
        } else {
            setActiveSlide(prev => prev + 1)
        }
    }

    const toPrev = () => {
        if (activeSlide === 0) {
            setActiveSlide(slides.length - 1)
        } else {
            setActiveSlide(prev => prev - 1)
        }
    }

    return (
        <div className={classes.globalContainer}>
            <h2>Наши работы:</h2>
            <div className={classes.slider}>
                <div className={classes.slidesWrapper}>
                    {slides.map((slide, index) =>
                        <img key={index} src={slide} alt='slide' className={classNames(classes.slide, { [classes.active]: activeSlide === index })} />
                    )}
                </div>
                <div className={classes.nextBtn}><img src={sliderArrow} alt="next" onClick={toNext} /></div>
                <div className={classes.prevBtn}><img src={sliderArrow} alt="previous" onClick={toPrev} /></div>
                <div className={classes.pagination}>
                    {slides.map((_, index) =>
                        <div key={index} className={classNames(classes.paginationCircle, { [classes.active]: activeSlide === index })} onClick={() => setActiveSlide(index)}></div>
                    )}
                </div>
            </div>
        </div>
    )
}