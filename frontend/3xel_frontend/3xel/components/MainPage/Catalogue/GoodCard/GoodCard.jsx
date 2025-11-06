import { useState, useRef, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import Button from '../../../Button/Button'
import PopUp from '../../../PopUp/PopUp'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../store/cartSlice'
import { HashLink } from 'react-router-hash-link'

import classes from './GoodCard.module.scss'

const DEFAULT_COLOR = '#d8b98a'

export default function GoodCard({ goods, forConstructor }) {

    const dispatcher = useDispatch()
    const good = goods?.[0]

    const variants = useMemo(() => good?.variants || [], [good])
    const initialVariant = variants[0] || {
        id: null,
        color: DEFAULT_COLOR,
        colorName: 'Цвет',
        images: [],
    }

    const uniqueColors = useMemo(() => {
        const colors = variants.map((v) => v.color || DEFAULT_COLOR)
        return colors.length ? [...new Set(colors)] : [DEFAULT_COLOR]
    }, [variants])

    const uniqueSizes = useMemo(() => {
        const sizes = goods?.map(item => item.size || '—')
        const sortedSizes = sizes.sort((a, b) => a - b)
        return sortedSizes
    }, [goods])

    const uniqueImages = useMemo(() => {
        const allImages = variants.flatMap((v) => (v.images || [])).filter(Boolean)
        const images = allImages.length ? allImages : (initialVariant.images || []).filter(Boolean)
        return [...new Set(images)]
    }, [variants, initialVariant.images])

    const [selectedColor, setSelectedColor] = useState(initialVariant.color || DEFAULT_COLOR)
    const [selectedSize, setSelectedSize] = useState(goods?.[0].size || '—')
    const selectedGood = useMemo(() =>
        goods?.find(item => item.size === selectedSize),
        [goods, selectedSize]
    )

    const [cdekWidth, cdekHeight, cdekLength] = useMemo(() => {

        if (!selectedGood) return [null, null, null]

        const sizes = selectedGood?.box_sizes.replace(',', '.').split('-').map(Number)
        return sizes
    }, [selectedGood, goods])

    const cdekWeight = useMemo(() => {
        if (!selectedGood) return

        return Number(selectedGood?.weight.replace(',', '.'))
    }, [selectedGood, goods])

    const [userSelected, setUserSelected] = useState(false)
    const selectedVariant = useMemo(
        () =>
            variants.find(
                (v) => v.color === selectedColor,
            ) || initialVariant,
        [selectedColor, variants, initialVariant, selectedGood]
    )

    const [selectedImage, setSelectedImage] = useState(
        selectedVariant?.images?.[0] || uniqueImages[0] || null,
    )

    const [popupIsActive, setPopupIsActive] = useState(false)

    useEffect(() => {
        const newVariant = variants.find(v =>
            v.color === selectedColor
        )

        if (newVariant?.images?.length) {
            setSelectedImage(newVariant.images[0])
        }

    }, [selectedVariant, variants, selectedColor, selectedGood, selectedSize])

    useEffect(() => {
        if (!uniqueImages.length) {
            return
        }

        if (!selectedVariant?.images?.length && !selectedImage) {
            setSelectedImage(uniqueImages[0])
            return
        }

        if (selectedImage && !uniqueImages.includes(selectedImage)) {
            setSelectedImage(uniqueImages[0])
        }
    }, [uniqueImages, selectedVariant, selectedImage])

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
        if (!selectedVariant?.id) {
            return
        }

        dispatcher(addToCart({
            id: selectedVariant.id,
            type: selectedVariant.type,
            name: selectedGood.name,
            color: selectedColor,
            size: selectedSize,
            colorName: selectedVariant.colorName || 'Цвет',
            cost: selectedGood.cost ?? 0,
            width: cdekWidth,
            height: cdekHeight,
            boxLength: cdekLength,
            weight: cdekWeight,
        }))
        setPopupIsActive(true)
        setTimeout(() => setPopupIsActive(false), 3000)
    }

    return (
        <div className={classes.goodCard}>
            <PopUp isActive={popupIsActive}>Товар добавлен в конструктор</PopUp>
            <div className={classes.imageContainer}>
                {uniqueImages.map(image => (
                    <img
                        key={image}
                        src={image}
                        className={classNames(classes.image, { [classes.active]: image === selectedImage })}
                        loading='lazy'
                    />
                ))}
            </div>
            <div className={classes.properties}>
                <div className={classes.technologies}>

                    {good?.technology?.map(tech => (
                        <span key={tech} className={classes.technology}>
                            {tech}
                        </span>
                    ))}

                </div>
                <h4 className={classes.goodName}>
                    {good?.name}
                </h4>
                {forConstructor ? (
                    null
                ) : (
                    <div className={classes.description}>
                        {good?.description}
                    </div>
                )}
                {forConstructor ? (
                    <div className={classes.sizes}>
                        <span>Размеры</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {uniqueSizes ? (
                                uniqueSizes.map((size) => (
                                    <div
                                        key={size}
                                        className={classNames(classes.size, { [classes.active]: selectedSize === size })}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size} см
                                    </div>
                                ))
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
                                <span key={color} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', outline: selectedColor === color ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }}>
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
                    {(selectedVariant.images?.length ? selectedVariant.images : uniqueImages).map(image =>
                        <img
                            key={image}
                            src={image}
                            alt={`${good?.name} в цвете ${selectedVariant.colorName || ''}`}
                            onClick={() => { setSelectedImage(image); setUserSelected(true) }} style={{ outline: image === selectedImage ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }}
                            loading='lazy'
                        >
                        </img>)
                    }
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
