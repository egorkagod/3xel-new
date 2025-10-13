import classes from './GoodCard.module.scss'
import { useState, useRef, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import Button from '../../../Button/Button'

export default function GoodCard({ good }) {

    const uniqueColors = useMemo(() => [...new Set(good.variants.map(v => v.color))], [good])
    const uniqueSizes = useMemo(() => [...new Set(good.variants.map(v => v.size))], [good])
    const uniqueImages = useMemo(() => [...new Set(good.variants.map(v => v.images).flat())], [good])

    const [selectedColor, setSelectedColor] = useState(good.variants[0].color)
    const [selectedSize, setSelectedSize] = useState(good.variants[0].size)
    const [userSelected, setUserSelected] = useState(false)
    const selectedVariant = good.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
    ) || good.variants[0]

    const [selectedImage, setSelectedImage] = useState(selectedVariant ? selectedVariant.images[0] : null)

    useEffect(() => {
        const newVariant = good.variants.find(v =>
            v.color === selectedColor && v.size === selectedSize
        )

        if (newVariant?.images?.length) {
            setSelectedImage(newVariant.images[0])
        }

    }, [selectedVariant])

    let index = useRef(0)

    useEffect(() => {
        if (userSelected) return

        if (uniqueColors.length <= 1) return

        const intervalId = setInterval(() => {
            setSelectedColor(uniqueColors[index.current])
            index.current = (index.current + 1) % uniqueColors.length
        }, 4000)

        return () => clearInterval(intervalId)
    }, [userSelected, uniqueColors])

    return (
        <div className={classes.goodCard}>
            <div className={classes.imageContainer}>
                {uniqueImages.map(image => <img src={image} className={classNames(classes.image, { [classes.active]: image === selectedImage })} />)}
            </div>
            <div className={classes.properties}>
                <div className={classes.technologies}>
                    {good.technology ? (
                        good.technology.map(tech => <span className={classes.technology}>
                            {tech}
                        </span>)
                    ) : null}
                </div>
                <h4 className={classes.goodName}>
                    {good.name}
                </h4>
                <div className={classes.description}>
                    {good.description}
                </div>
                <div className={classes.colors} >
                    {uniqueColors ? (
                        uniqueColors.map(color =>
                            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', outline: selectedColor === color ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }}>
                                <span
                                    style={{
                                        background: color, borderRadius: '50%',
                                        width: '24px', height: '24px',
                                        border: '1px solid rgba(0,0,0,.12)',
                                        cursor: 'pointer', display: 'flex',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    onClick={() => { setSelectedColor(color); setUserSelected(true) }}>
                                </span>
                            </span>
                        )
                    ) : null}
                </div>
                <div className={classes.images}>
                    {selectedVariant.images ? (
                        selectedVariant.images.map(image =>
                            <img
                                src={image} alt={`${good.name} в цвете ${selectedVariant.colorName}`}
                                onClick={() => { setSelectedImage(image); setUserSelected(true) }} style={{ outline: image === selectedImage ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }}>
                            </img>)
                    ) : null}
                </div>

                <div className={classes.buttonContainer}>
                    <Button color='golden'>Создать</Button>
                </div>
            </div>
        </div>
    )
}