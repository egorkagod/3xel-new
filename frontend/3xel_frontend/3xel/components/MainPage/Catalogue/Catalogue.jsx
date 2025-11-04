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
            return <span className={classes.stateMessage}>{'Не удалось загрузить каталог'}</span>
        }

        if (!goods.length) {
            return <span className={classes.stateMessage}>Каталог пока пуст.</span>
        }

        const resultGoods = goods.reduce((acc, cur) => {
            if (!acc[cur.name]) {
                acc[cur.name] = []
            }

            acc[cur.name].push(cur)
            return acc
        }, {})

        console.log(resultGoods)

        return Object.entries(resultGoods).map(([name, items]) => (
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
