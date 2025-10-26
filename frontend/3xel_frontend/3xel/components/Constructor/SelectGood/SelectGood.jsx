import classes from './SelectGood.module.scss'
import GoodCard from '../../MainPage/Catalogue/GoodCard/GoodCard'
import Certificate from './Certificates/Certificate'
import { useSelector } from 'react-redux'

export default function SelectGood() {
    const goods = useSelector((state) => state.goods.busts)
    const certificates = useSelector((state) => state.goods.certificates)
    const goodsStatus = useSelector((state) => state.goods.status)
    const goodsError = useSelector((state) => state.goods.error)

    const renderGoods = () => {
        if (goodsStatus === 'loading') {
            return <span className={classes.stateMessage}>Загружаем каталог...</span>
        }

        if (goodsStatus === 'failed') {
            return <span className={classes.stateMessage}>{goodsError || 'Не удалось загрузить каталог'}</span>
        }

        if (!goods.length) {
            return <span className={classes.stateMessage}>Каталог пока пуст.</span>
        }

        return goods.map((good) => (
            <GoodCard key={good.id} forConstructor={true} good={good}></GoodCard>
        ))
    }

    return (
        <section className={classes.selectGoodSection} id='goods'>
            <h2>1. Выбор изделий</h2>
            <div className={classes.goodsBlock}>
                {renderGoods()}
                {certificates.map((certificate) => (
                    <Certificate key={certificate.id} certificate={certificate} id='certificate'></Certificate>
                ))}
            </div>
        </section>
    )
}
