import classes from './ProductCard.module.scss'
import { useState } from 'react'
import classNames from 'classnames'
import { addToCart, removeFromCart } from '../../store/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
    const navigate = useNavigate()
    const [cost, setCost] = useState(product.variants[0].price)
    const [selectedSize, setSelectedSize] = useState(product.variants[0].size)
    const [selectedColor, setSelectedColor] = useState(product.variants[0].color)
    const dispatch = useDispatch()
    const cartData = useSelector(state => state.cart.items)
    const count = cartData.filter(
        item =>
            item.title === product.name &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
    ).length
    const variantId = useMemo(() => {
        const match = product.variants.find(v => v.size === selectedSize && v.color === selectedColor)
        return match?.id || null
    }, [selectedSize, selectedColor, product.variants])
    const colors = product.variants.map((variant) => variant.color)
    const uniqueColors = [...new Set(colors)]
    const sizesAndCosts = product.variants.map(variant => ({ size: variant.size, price: variant.price }))
    const uniqueSizesAndCosts = [...new Map(sizesAndCosts.map(item => [item.size, item])).values()]
    const selectedVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor)

    return (
        <div className={classes.globalContainer} style={{ backgroundImage: selectedVariant ? `url(${selectedVariant.image})` : 'none' }} onClick={() => {navigate(`/good/${product.id}`)}}>
            <div className={classes.productInfo}>

                <div className={classes.title} onClick={(e) => e.stopPropagation()}>
                    <span>{product.name}</span>
                    <span>{cost} ₽</span>
                </div>

                <div className={classes.productFooter} onClick={(e) => e.stopPropagation()}>
                    <div className={classes.colors}>
                        {uniqueColors.map((color) =>
                            <div key={color} className={classNames(classes.colorCircle, { [classes.active]: color === selectedColor })} onClick={(e) => {setSelectedColor(color); e.stopPropagation()}} style={{ backgroundColor: color }}></div>
                        )}
                    </div>
                    <div className={classes.sizes} onClick={(e) => e.stopPropagation()}>
                        {uniqueSizesAndCosts.map((item, index) =>
                            <span key={index} className={classNames(classes.size, { [classes.active]: item.size === selectedSize })} onClick={(e) => { setSelectedSize(item.size); setCost(item.price); e.stopPropagation()}}>{item.size}</span>
                        )}
                    </div>
                    {count === 0 ? (
                        <button style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className={classes.addToCartBtn} onClick={(e) => {dispatch(addToCart({ id: variantId, title: product.name, background: selectedVariant.image, selectedColor, selectedSize, cost })); e.stopPropagation()}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width='16' height='16'>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            В корзину
                        </button>
                    ) : (
                        <div style={{ display: count ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', border: '1px solid black', borderRadius: '100px', padding: '10px', gap: '20px', position: 'relative', backgroundColor: 'white', height: 'fit-content' }}>
                            <button style={{ all: 'unset', color: 'red', cursor: 'pointer', fontSize: '20px' }} onClick={(e) => {dispatch(removeFromCart({ title: product.name, selectedSize, selectedColor })); e.stopPropagation()}}>-</button>
                            <span style={{ fontSize: '12px' }}>{count}</span>
                            <button style={{ all: 'unset', color: 'green', cursor: 'pointer', fontSize: '20px' }} onClick={(e) => {dispatch(addToCart({ id: variantId, title: product.name, background: selectedVariant.image, selectedColor, selectedSize, cost })); e.stopPropagation()}}>+</button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}