import classes from './GoodPage.module.scss'
import { useParams } from 'react-router'
import { useState, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../store/cartSlice'
import { toast } from 'react-toastify'

export default function GoodPage() {

    const cartData = useSelector(state => state.cart.items)
    const dispatch = useDispatch()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [product, setProduct] = useState({})
    const [hasError, setHasError] = useState(false)
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [cost, setCost] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true)
                setHasError(false)
                const response = await fetch(`/api-order/good?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                const data = await response.json()
                setProduct(data)
            } catch {
                toast.error('Ошибка при загрузке товара.')
                setHasError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id])

    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedColor(product.variants[0].color)
            setSelectedSize(product.variants[0].size)
            setCost(product.variants[0].price)
        }
    }, [product.variants])


    const variantId = useMemo(() => {
        if (!product.variants) return null
        const match = product.variants.find(v => v.size === selectedSize && v.color === selectedColor)
        return match?.id || null
    }, [selectedSize, selectedColor, product.variants])
    const colors = product.variants ? product.variants.map((variant) => variant.color) : []
    const uniqueColors = [...new Set(colors)]
    const sizesAndCosts = product.variants ? product.variants.map(variant => ({ size: variant.size, price: variant.price })) : []
    const uniqueSizesAndCosts = [...new Map(sizesAndCosts.map(item => [item.size, item])).values()]
    const count = cartData.filter(item =>
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        item.title === product.name
    ).length

    return (
        <div className={classes.globalContainer}>
            <div style={{ backgroundImage: variantId ? `url(${product.variants.find(v => v.id === variantId).image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '12px', boxShadow: '2px 2px 10px black' }} className={classes.image}></div>
            <div className={classes.infoAboutGood}>
                <div className={classes.goodHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>{product.name}</h2>
                    <span style={{ fontSize: '20px' }}>{cost} ₽</span>
                </div>
                <div className={classes.sizes}>
                    <span>Выберите высоту модельки (см):</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {uniqueSizesAndCosts.map((variant, index) => <div key={index} onClick={() => { setSelectedSize(variant.size); setCost(variant.price) }} style={{ cursor: 'pointer' }} className={classNames(classes.size, {[classes.active] : selectedSize === variant.size})}>{variant.size}</div>)}
                    </div>
                </div>
                <div className={classes.colors}>
                    <span>Выберите цвет:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {uniqueColors.map((color, index) => <div style={{ backgroundColor: color, borderRadius: '50%', width: '30px', height: '30px', border: '2px solid', borderColor: selectedColor === color ? 'green' : 'grey', cursor: 'pointer' }} key={index} onClick={() => setSelectedColor(color)}></div>)}
                    </div>
                </div>
                <div>
                    {count === 0 ? (<button style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'black', padding: '10px 0', width: '50%' }} className={classes.addToCartBtn} onClick={(e) => { dispatch(addToCart({ id: variantId, title: product.name, background: product.variants.find(v => v.id === variantId).image, selectedColor, selectedSize, cost: product.variants.find(v => v.id === variantId).price })); e.stopPropagation() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width='18' height='18'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>

                        В корзину
                    </button>) : (
                        <div style={{ display: count ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', border: '1px solid black', borderRadius: '100px', padding: '10px 0', gap: '20px', position: 'relative', backgroundColor: 'black', height: 'fit-content', width: '50%' }}>
                            <button style={{ all: 'unset', color: 'red', cursor: 'pointer', fontSize: '20px', position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)' }} onClick={(e) => { dispatch(removeFromCart({ title: product.name, selectedSize, selectedColor })); e.stopPropagation() }}>-</button>
                            <span style={{ fontSize: '20px', color: 'white' }}>{count}</span>
                            <button style={{ all: 'unset', color: 'green', cursor: 'pointer', fontSize: '20px', position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)' }} onClick={(e) => { dispatch(addToCart({ id: variantId, title: product.name, background: product.variants.find(v => v.id === variantId).image, selectedColor, selectedSize, cost: product.variants.find(v => v.id === variantId).price })); e.stopPropagation() }}>+</button>
                        </div>
                    )}
                </div>
            </div>
            <div className={classes.description}>
                    <h3>Описание:</h3>
                    {product.description}
            </div>
        </div>
    )
}