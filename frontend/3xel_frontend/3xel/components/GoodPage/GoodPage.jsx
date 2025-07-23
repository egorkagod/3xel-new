import classes from './GoodPage.module.scss'
import { useParams } from 'react-router'
import { useState, useMemo } from 'react'
import variantImage16 from '/images/good-variant-1-6.jpg'
import variantImage712 from '/images/good-variant-7-12.jpg'
import variantImage1318 from '/images/good-variant-13-18.jpg'
import variantImage1924 from '/images/good-variant-19-24.jpg'
import variantImage2530 from '/images/good-variant-25-30.jpg'
import variantImage3136 from '/images/good-variant-31-36.jpg'
import variantImage3742 from '/images/good-variant-37-42.jpg'
import variantImage4348 from '/images/good-variant-43-48.jpg'
import variantImage4954 from '/images/good-variant-49-54.jpg'
import variantImage5560 from '/images/good-variant-55-60.jpg'
import variantImage6166 from '/images/good-variant-61-66.jpg'
import variantImage67 from '/images/good-variant-67.jpg'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../store/cartSlice'

export default function GoodPage() {

    const cartData = useSelector(state => state.cart.items)
    const dispatcher = useDispatch()
    const products = useSelector(state => state.goods.products)

    // const products = [
    //     {
    //         id: 1,
    //         name: "3D модель из PLA-пластика",
    //         description: 'Конструктор из картона. Если вы предпочитаете что-то более традиционное, мы предлагаем бюсты в виде конструкторов из картона. Этот материал также экологичен и позволяет вам самостоятельно собрать свою уникальную модель.',
    //         variants: [
    //             {
    //                 id: 1,
    //                 size: '10 см',
    //                 color: 'rgb(117, 122, 126)',
    //                 price: 3200,
    //                 image: variantImage16,
    //             }, {
    //                 id: 2,
    //                 size: '12 см',
    //                 color: 'rgb(117, 122, 126)',
    //                 price: 3450,
    //                 image: variantImage16,
    //             }, {
    //                 id: 3,
    //                 size: '14 см',
    //                 color: 'rgb(117, 122, 126)',
    //                 price: 3800,
    //                 image: variantImage16,
    //             }, {
    //                 id: 4,
    //                 size: '16 см',
    //                 color: 'rgb(117, 122, 126)',
    //                 price: 4200,
    //                 image: variantImage16,
    //             }, {
    //                 id: 5,
    //                 size: '18 см',
    //                 color: 'rgb(117, 122, 126)',
    //                 price: 4700,
    //                 image: variantImage16,
    //             }, {
    //                 id: 6,
    //                 size: '20 см',
    //                 color: 'rgb(117, 122, 126)',
    //                 price: 5200,
    //                 image: variantImage16,
    //             }, {
    //                 id: 7,
    //                 size: '10 см',
    //                 color: 'rgb(240, 67, 60)',
    //                 price: 3200,
    //                 image: variantImage712,
    //             }, {
    //                 id: 8,
    //                 size: '12 см',
    //                 color: 'rgb(240, 67, 60)',
    //                 price: 3450,
    //                 image: variantImage712,
    //             }, {
    //                 id: 9,
    //                 size: '14 см',
    //                 color: 'rgb(240, 67, 60)',
    //                 price: 3800,
    //                 image: variantImage712,
    //             }, {
    //                 id: 10,
    //                 size: '16 см',
    //                 color: 'rgb(240, 67, 60)',
    //                 price: 4200,
    //                 image: variantImage712,
    //             }, {
    //                 id: 11,
    //                 size: '18 см',
    //                 color: 'rgb(240, 67, 60)',
    //                 price: 4700,
    //                 image: variantImage712,
    //             }, {
    //                 id: 12,
    //                 size: '20 см',
    //                 color: 'rgb(240, 67, 60)',
    //                 price: 5200,
    //                 image: variantImage712,
    //             }, {
    //                 id: 13,
    //                 size: '10 см',
    //                 color: 'rgb(47, 180, 71)',
    //                 price: 3200,
    //                 image: variantImage1318,
    //             }, {
    //                 id: 14,
    //                 size: '12 см',
    //                 color: 'rgb(47, 180, 71)',
    //                 price: 3450,
    //                 image: variantImage1318,
    //             }, {
    //                 id: 15,
    //                 size: '14 см',
    //                 color: 'rgb(47, 180, 71)',
    //                 price: 3800,
    //                 image: variantImage1318,
    //             }, {
    //                 id: 16,
    //                 size: '16 см',
    //                 color: 'rgb(47, 180, 71)',
    //                 price: 4200,
    //                 image: variantImage1318,
    //             }, {
    //                 id: 17,
    //                 size: '18 см',
    //                 color: 'rgb(47, 180, 71)',
    //                 price: 4700,
    //                 image: variantImage1318,
    //             }, {
    //                 id: 18,
    //                 size: '20 см',
    //                 color: 'rgb(47, 180, 71)',
    //                 price: 5200,
    //                 image: variantImage1318,
    //             }, {
    //                 id: 19,
    //                 size: '10 см',
    //                 color: 'rgb(236, 105, 17)',
    //                 price: 3200,
    //                 image: variantImage1924,
    //             }, {
    //                 id: 20,
    //                 size: '12 см',
    //                 color: 'rgb(236, 105, 17)',
    //                 price: 3450,
    //                 image: variantImage1924,
    //             }, {
    //                 id: 21,
    //                 size: '14 см',
    //                 color: 'rgb(236, 105, 17)',
    //                 price: 3800,
    //                 image: variantImage1924,
    //             }, {
    //                 id: 22,
    //                 size: '16 см',
    //                 color: 'rgb(236, 105, 17)',
    //                 price: 4200,
    //                 image: variantImage1924,
    //             }, {
    //                 id: 23,
    //                 size: '18 см',
    //                 color: 'rgb(236, 105, 17)',
    //                 price: 4700,
    //                 image: variantImage1924,
    //             }, {
    //                 id: 24,
    //                 size: '20 см',
    //                 color: 'rgb(236, 105, 17)',
    //                 price: 5200,
    //                 image: variantImage1924,
    //             }, {
    //                 id: 25,
    //                 size: '10 см',
    //                 color: 'rgb(228, 208, 0)',
    //                 price: 3200,
    //                 image: variantImage2530,
    //             }, {
    //                 id: 26,
    //                 size: '12 см',
    //                 color: 'rgb(228, 208, 0)',
    //                 price: 3450,
    //                 image: variantImage2530,
    //             }, {
    //                 id: 27,
    //                 size: '14 см',
    //                 color: 'rgb(228, 208, 0)',
    //                 price: 3800,
    //                 image: variantImage2530,
    //             }, {
    //                 id: 28,
    //                 size: '16 см',
    //                 color: 'rgb(228, 208, 0)',
    //                 price: 4200,
    //                 image: variantImage2530,
    //             }, {
    //                 id: 29,
    //                 size: '18 см',
    //                 color: 'rgb(228, 208, 0)',
    //                 price: 4700,
    //                 image: variantImage2530,
    //             }, {
    //                 id: 30,
    //                 size: '20 см',
    //                 color: 'rgb(228, 208, 0)',
    //                 price: 5200,
    //                 image: variantImage2530,
    //             }, {
    //                 id: 31,
    //                 size: '10 см',
    //                 color: 'rgb(178, 118, 170)',
    //                 price: 3200,
    //                 image: variantImage3136,
    //             }, {
    //                 id: 32,
    //                 size: '12 см',
    //                 color: 'rgb(178, 118, 170)',
    //                 price: 3450,
    //                 image: variantImage3136,
    //             }, {
    //                 id: 33,
    //                 size: '14 см',
    //                 color: 'rgb(178, 118, 170)',
    //                 price: 3800,
    //                 image: variantImage3136,
    //             }, {
    //                 id: 34,
    //                 size: '16 см',
    //                 color: 'rgb(178, 118, 170)',
    //                 price: 4200,
    //                 image: variantImage3136,
    //             }, {
    //                 id: 35,
    //                 size: '18 см',
    //                 color: 'rgb(178, 118, 170)',
    //                 price: 4700,
    //                 image: variantImage3136,
    //             }, {
    //                 id: 36,
    //                 size: '20 см',
    //                 color: 'rgb(178, 118, 170)',
    //                 price: 5200,
    //                 image: variantImage3136,
    //             }, {
    //                 id: 37,
    //                 size: '10 см',
    //                 color: 'rgb(1, 99, 206)',
    //                 price: 3200,
    //                 image: variantImage3742
    //             }, {
    //                 id: 38,
    //                 size: '12 см',
    //                 color: 'rgb(1, 99, 206)',
    //                 price: 3450,
    //                 image: variantImage3742
    //             }, {
    //                 id: 39,
    //                 size: '14 см',
    //                 color: 'rgb(1, 99, 206)',
    //                 price: 3800,
    //                 image: variantImage3742
    //             }, {
    //                 id: 40,
    //                 size: '16 см',
    //                 color: 'rgb(1, 99, 206)',
    //                 price: 4200,
    //                 image: variantImage3742
    //             }, {
    //                 id: 41,
    //                 size: '18 см',
    //                 color: 'rgb(1, 99, 206)',
    //                 price: 4700,
    //                 image: variantImage3742
    //             }, {
    //                 id: 42,
    //                 size: '20 см',
    //                 color: 'rgb(1, 99, 206)',
    //                 price: 5200,
    //                 image: variantImage3742
    //             }, {
    //                 id: 43,
    //                 size: '10 см',
    //                 color: 'rgb(146, 57, 27)',
    //                 price: 3200,
    //                 image: variantImage4348,
    //             }, {
    //                 id: 44,
    //                 size: '12 см',
    //                 color: 'rgb(146, 57, 27)',
    //                 price: 3450,
    //                 image: variantImage4348,
    //             }, {
    //                 id: 45,
    //                 size: '14 см',
    //                 color: 'rgb(146, 57, 27)',
    //                 price: 3800,
    //                 image: variantImage4348,
    //             }, {
    //                 id: 46,
    //                 size: '16 см',
    //                 color: 'rgb(146, 57, 27)',
    //                 price: 4200,
    //                 image: variantImage4348,
    //             }, {
    //                 id: 47,
    //                 size: '18 см',
    //                 color: 'rgb(146, 57, 27)',
    //                 price: 4700,
    //                 image: variantImage4348,
    //             }, {
    //                 id: 48,
    //                 size: '20 см',
    //                 color: 'rgb(146, 57, 27)',
    //                 price: 5200,
    //                 image: variantImage4348,
    //             }, {
    //                 id: 49,
    //                 size: '10 см',
    //                 color: 'rgb(255, 255, 255)',
    //                 price: 3200,
    //                 image: variantImage4954,
    //             }, {
    //                 id: 50,
    //                 size: '12 см',
    //                 color: 'rgb(255, 255, 255)',
    //                 price: 3450,
    //                 image: variantImage4954,
    //             }, {
    //                 id: 51,
    //                 size: '14 см',
    //                 color: 'rgb(255, 255, 255)',
    //                 price: 3800,
    //                 image: variantImage4954,
    //             }, {
    //                 id: 52,
    //                 size: '16 см',
    //                 color: 'rgb(255, 255, 255)',
    //                 price: 4200,
    //                 image: variantImage4954,
    //             }, {
    //                 id: 53,
    //                 size: '18 см',
    //                 color: 'rgb(255, 255, 255)',
    //                 price: 4700,
    //                 image: variantImage4954,
    //             }, {
    //                 id: 54,
    //                 size: '20 см',
    //                 color: 'rgb(255, 255, 255)',
    //                 price: 5200,
    //                 image: variantImage4954,
    //             }, {
    //                 id: 55,
    //                 size: '10 см',
    //                 color: 'rgb(237, 229, 216)',
    //                 price: 3200,
    //                 image: variantImage5560,
    //             }, {
    //                 id: 56,
    //                 size: '12 см',
    //                 color: 'rgb(237, 229, 216)',
    //                 price: 3450,
    //                 image: variantImage5560,
    //             }, {
    //                 id: 57,
    //                 size: '14 см',
    //                 color: 'rgb(237, 229, 216)',
    //                 price: 3800,
    //                 image: variantImage5560,
    //             }, {
    //                 id: 58,
    //                 size: '16 см',
    //                 color: 'rgb(237, 229, 216)',
    //                 price: 4200,
    //                 image: variantImage5560,
    //             }, {
    //                 id: 59,
    //                 size: '18 см',
    //                 color: 'rgb(237, 229, 216)',
    //                 price: 4700,
    //                 image: variantImage5560,
    //             }, {
    //                 id: 60,
    //                 size: '20 см',
    //                 color: 'rgb(237, 229, 216)',
    //                 price: 5200,
    //                 image: variantImage5560,
    //             }, {
    //                 id: 61,
    //                 size: '10 см',
    //                 color: 'rgb(0, 0, 0)',
    //                 price: 3200,
    //                 image: variantImage6166,
    //             }, {
    //                 id: 62,
    //                 size: '12 см',
    //                 color: 'rgb(0, 0, 0)',
    //                 price: 3450,
    //                 image: variantImage6166,
    //             }, {
    //                 id: 63,
    //                 size: '14 см',
    //                 color: 'rgb(0, 0, 0)',
    //                 price: 3800,
    //                 image: variantImage6166,
    //             }, {
    //                 id: 64,
    //                 size: '16 см',
    //                 color: 'rgb(0, 0, 0)',
    //                 price: 4200,
    //                 image: variantImage6166,
    //             }, {
    //                 id: 65,
    //                 size: '18 см',
    //                 color: 'rgb(0, 0, 0)',
    //                 price: 4700,
    //                 image: variantImage6166,
    //             }, {
    //                 id: 66,
    //                 size: '20 см',
    //                 color: 'rgb(0, 0, 0)',
    //                 price: 5200,
    //                 image: variantImage6166,
    //             },
    //         ],
    //     },

    //     {
    //         id: 2,
    //         name: 'Конструктор из картона',
    //         description: '3D-печать из PLA-пластика. Этот экологичный материал не только безопасен для окружающей среды, но и обеспечивает высокую детализацию и прочность готового изделия. PLA-пластик производится из возобновляемых ресурсов, таких как кукуруза или картофельный крахмал, что делает его отличным выбором для тех, кто заботится о природе.',
    //         variants: [
    //             {
    //                 id: 67,
    //                 size: '18 см',
    //                 color: 'rgb(167, 106, 56)',
    //                 price: 3500,
    //                 image: variantImage67,
    //             }
    //         ]
    //     }
    // ]

    const { id } = useParams()
    const currentProduct = products.find(product => product.id === Number(id))
    const [selectedColor, setSelectedColor] = useState(currentProduct.variants[0].color)
    const [selectedSize, setSelectedSize] = useState(currentProduct.variants[0].size)
    const variantId = useMemo(() => {
        const match = currentProduct.variants.find(v => v.size === selectedSize && v.color === selectedColor)
        return match?.id || null
    }, [selectedSize, selectedColor, currentProduct.variants])
    const colors = currentProduct.variants.map((variant) => variant.color)
    const uniqueColors = [...new Set(colors)]
    const sizesAndCosts = currentProduct.variants.map(variant => ({ size: variant.size, price: variant.price }))
    const uniqueSizesAndCosts = [...new Map(sizesAndCosts.map(item => [item.size, item])).values()]
    const count = cartData.filter(item =>
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        item.title === currentProduct.name
    )


    return (
        <div className={classes.globalContainer}>
            <div style={{ width: '100%', height: '100%', backgroundImage: `url(${currentProduct.variants.find(v => v.id === variantId).image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
            <div className={classes.infoAboutGood}>
                <h2>{currentProduct.name}</h2>
                <div className={classes.sizes}>
                    <span>Выберите высоту модельки:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {uniqueSizesAndCosts.map((variant, index) => <div key={index} onClick={() => setSelectedSize(variant.size)} style={{ fontSize: '20px', textDecoration: selectedSize === variant.size ? 'underline' : 'none', cursor: 'pointer' }}>{variant.size}</div>)}
                    </div>
                </div>
                <div className={classes.colors}>
                    <span>Выберите цвет:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {uniqueColors.map((color, index) => <div style={{ backgroundColor: color, borderRadius: '50%', width: '30px', height: '30px', border: '2px solid', borderColor: selectedColor === color ? 'green' : 'grey', cursor: 'pointer' }} key={index} onClick={() => setSelectedColor(color)}></div>)}
                    </div>
                </div>
                
            </div>
        </div>
    )
}