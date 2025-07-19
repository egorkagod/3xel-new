import classes from './ProductCard.module.scss'
import { useState } from 'react'
import classNames from 'classnames'
import { addToCart, removeFromCart } from '../../store/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'

export default function ProductCard({ background, product }) {
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

    return (
        <div className={classes.globalContainer} style={{ backgroundImage: `black` }}>
            <div className={classes.productInfo}>

                <div className={classes.title}>
                    <span>{product.name}</span>
                    <span>{cost} руб.</span>
                </div>

                <div className={classes.productFooter}>
                    <div className={classes.colors}>
                        {uniqueColors.map((color) =>
                            <div key={color} className={classNames(classes.colorCircle, { [classes.active]: color === selectedColor })} onClick={() => setSelectedColor(color)} style={{ backgroundColor: color }}></div>
                        )}
                    </div>
                    <div className={classes.sizes}>
                        {uniqueSizesAndCosts.map((item, index) =>
                            <span key={index} className={classNames(classes.size, { [classes.active]: item.size === selectedSize })} onClick={() => { setSelectedSize(item.size), setCost(item.price) }}>{item.size}</span>
                        )}
                    </div>
                    {count === 0 ? (
                        <button style={{ display: 'flex' }} className={classes.addToCartBtn} onClick={() => dispatch(addToCart({ id: variantId, title: product.name, background: product.image, selectedColor, selectedSize, cost }))}>В корзину</button>
                    ) : (
                        <div style={{ display: count ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', border: '1px solid black', borderRadius: '100px', padding: '10px', gap: '20px', position: 'relative', backgroundColor: 'white' }}>
                            <button style={{ all: 'unset', color: 'red', cursor: 'pointer', fontSize: '18px' }} onClick={() => dispatch(removeFromCart({ title: product.name, selectedSize, selectedColor }))}>-</button>
                            <span style={{ fontSize: '12px' }}>{count}</span>
                            <button style={{ all: 'unset', color: 'green', cursor: 'pointer', fontSize: '18px' }} onClick={() => dispatch(addToCart({ id: variantId, title: product.name, background: product.image, selectedColor, selectedSize, cost }))}>+</button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}