import classes from './SelectGood.module.scss'
import GoodCard from '../../MainPage/Catalogue/GoodCard/GoodCard'
import Certificate from './Certificates/Certificate'
import { useSelector } from 'react-redux'

export default function SelectGood() {

    const goods = useSelector((state) => state.goods.busts)
    const certificates = useSelector((state) => state.goods.cerificates)

    return (
        <section className={classes.selectGoodSection} id='goods'>
            <h2>1. Выбор изделий</h2>
            <div className={classes.goodsBlock}>
                {goods.map(good => <GoodCard key={good.id} forConstructor={true} good={good}></GoodCard>)}
                {certificates.map(certificate => <Certificate key={certificate.id} certificate={certificate} id='certificate'></Certificate>)}
            </div>
        </section>
    )
}