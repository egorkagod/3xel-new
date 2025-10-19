import classes from './GoodCard.module.scss'
import { useState, useRef, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import Button from '../../../Button/Button'
import PopUp from '../../../PopUp/PopUp'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../store/cartSlice'
import { HashLink } from 'react-router-hash-link'

export default function GoodCard({ good, forConstructor }) {

    const dispatcher = useDispatch()

    const uniqueColors = useMemo(() => [...new Set(good.variants.map(v => v.color))], [good])
    const uniqueSizes = useMemo(() => [...new Set(good.variants.map(v => v.size))], [good])
    const uniqueImages = useMemo(() => [...new Set(good.variants.map(v => v.images).flat())], [good])

    const [selectedColor, setSelectedColor] = useState(good.variants[0].color)
    const [selectedSize, setSelectedSize] = useState(good.variants[0].size)
    const [userSelected, setUserSelected] = useState(false)
    const selectedVariant = useMemo(() => good.variants.find(v => v.size === selectedSize && v.color === selectedColor), [selectedColor, selectedSize]) || good.variants[0]

    const [selectedImage, setSelectedImage] = useState(selectedVariant ? selectedVariant.images[0] : null)

    const [popupIsActive, setPopupIsActive] = useState(false)

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

    const handleAddToCart = () => {
        dispatcher(addToCart({ id: selectedVariant.id, name: good.name, color: selectedColor, size: selectedSize, colorName: selectedVariant.colorName, cost: selectedVariant.cost }))
        setPopupIsActive(true)
        setTimeout(() => setPopupIsActive(false), 3000)
    }

    return (
        <div className={classes.goodCard}>
            <PopUp isActive={popupIsActive}>Товар добавлен в конструктор</PopUp>
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
                {forConstructor ? (
                    null
                ) : (
                    <div className={classes.description}>
                        {good.description}
                    </div>
                )}
                {forConstructor ? (
                    <div className={classes.sizes}>
                        <span>Размеры</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {uniqueSizes ? (
                                uniqueSizes.map((size, index) => <div key={index} className={classNames(classes.size, { [classes.active]: selectedSize === size })} onClick={() => setSelectedSize(size)}>{size}</div>)
                            ) : (null)}
                        </div>
                    </div>
                ) : (null)}
                <div className={classes.colorsBlock}>
                    {forConstructor ? (
                        <span>Цвет (PLA Matte)</span>
                    ) : (null)}
                    <div className={classes.colors}>
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
                    {forConstructor ? (
                        <Button color='golden' onClick={handleAddToCart}>Добавить</Button>
                    ) : (
                        <HashLink style={{ all: 'unset' }} to='/constructor#goods'>
                            <Button color='golden'>Создать</Button>
                        </HashLink>
                    )}

                </div>
            </div>
        </div>
    )
}