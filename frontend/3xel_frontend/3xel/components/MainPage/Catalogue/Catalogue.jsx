import classes from './Catalogue.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'
import GoodCard from './GoodCard/GoodCard'
import { useSelector } from 'react-redux'


export default function Catalogue() {

    const goods = useSelector((state) => state.goods.busts)

    return (
        <section className={classes.catalogue} id='catalogue'>
            <SectionHeader header='Каталог'>Два изделия — два характера. Оба — про память в форме.</SectionHeader>
            <div className={classes.goodsContainer}>
                {goods.map(good => (
                    <GoodCard key={good.id} good={good}></GoodCard>
                ))}
            </div>
        </section>
    )
}
