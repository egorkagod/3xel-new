import classes from './Catalogue.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'
import GoodCard from './GoodCard/GoodCard'
import { useSelector } from 'react-redux'


export default function Catalogue() {

    const goods = useSelector((state) => state.goods.busts)
    const status = useSelector((state) => state.goods.status)
    const error = useSelector((state) => state.goods.error)
    
    const renderGoods = () => {
        if (status === 'loading') {
            return <span className={classes.stateMessage}>Загружаем каталог...</span>
        }

        if (status === 'failed') {
            return <span className={classes.stateMessage}>{error || 'Не удалось загрузить каталог'}</span>
        }

        if (!goods.length) {
            return <span className={classes.stateMessage}>Каталог пока пуст.</span>
        }

        const busts = goods.reduce((acc, cur) => {
            const newKey = cur.name
            if (!acc[newKey]) {
                acc[newKey] = []
            }

            acc[newKey].push(cur)
            return acc
        }, {})

        const resultBusts = []
        resultBusts.push(Object.entries(busts)[1])
        const filtered = resultBusts.filter(item => item[0] !== 'Картонный бюст')
        const result = resultBusts.concat(filtered)

        return Object.entries(result).map(([name, items]) => (
            <GoodCard key={name} goods={items}></GoodCard>
        ))
    }

    return (
        <section className={classes.catalogue} id='catalogue'>
            <SectionHeader header='Каталог'>Два изделия — два характера. Оба — про память в форме.</SectionHeader>
            <div className={classes.goodsContainer}>
                {renderGoods()}
            </div>
        </section>
    )
}
