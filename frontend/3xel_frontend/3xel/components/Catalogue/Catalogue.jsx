import classes from './Catalogue.module.scss'
import ProductCard from './ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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
import { useDispatch } from 'react-redux'
import { addGoods } from '../store/goodsSlice'
import Loader from '../Loader/Loader'

export default function Catalogue() {

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const dispatcher = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api-order/catalogue/', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await response.json()
                setProducts(data)
            } catch (error) {
                toast.error('Ошибка при загрузке каталога')
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()

    }, [])

    dispatcher(addGoods(products))

    return (
        <main className={classes.globalContainer}>

            {isLoading ? <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', gap: '5px' }}> 
                <Loader color={'black'}></Loader>
                <span>Каталог загружается...</span>
            </div> : (

                products.map((product) =>
                    <>
                        <ProductCard key={product.id} product={product}></ProductCard>
                    </>
                )
            )}



        </main>
    )
}