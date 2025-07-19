import classes from './Catalogue.module.scss'
import ProductCard from './ProductCard/ProductCard'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Catalogue() {

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api-order/catalog/', {
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


    return (
        <main className={classes.globalContainer}>
            {isLoading ? (
                <span>Каталог загружается...</span>
            ) : (
                products.map((product) =>
                    <ProductCard key={product.id} background={product.image} product={product}></ProductCard>
                )
            )}
        </main>
    )
}