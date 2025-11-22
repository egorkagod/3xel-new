import classes from './Certificate.module.scss'
import Button from '../../../Button/Button'
import PopUp from '../../../PopUp/PopUp'
import classNames from 'classnames'
import { useState } from 'react'
import { addToCart } from '../../../../store/cartSlice'
import { useDispatch } from 'react-redux'
import { HashLink } from 'react-router-hash-link'

export default function Certificate({ certificate, id, isPrototype }) {

    const dispatcher = useDispatch()
    const [selectedDenomination, setSelectedDenomination] = useState(certificate.denominations ? certificate.denominations[0] : null)
    const [popupIsActive, setPopupIsActive] = useState(false)

    const handleAddTocart = () => {
        dispatcher(addToCart({
            id: certificate.id,
            name: certificate.name,
            denomination: selectedDenomination,
            cost: selectedDenomination,
            type: certificate.type,
            boxLength: certificate.boxLength ? certificate.boxLength : null,
            width: certificate.width ? certificate.width : null,
            height: certificate.height ? certificate.height : null,
            weight: certificate.weight ? certificate.weight : null
        }))
        setPopupIsActive(true)
        setTimeout(() => setPopupIsActive(false), 3000)
    }

    const [activeImage, setActiveImage] = useState(certificate.images[0])

    return (
        <div className={classes.certificate} id={id}>
            <PopUp isActive={popupIsActive}>Товар добавлен в конструктор</PopUp>
            <div className={classes.imageContainer}>
                {
                    certificate?.images?.map(image => <img  style={{ width: certificate.type === 'physical' ? '100%' : '50%' }} src={image} className={classNames(classes.image, { [classes.active]: image === activeImage })} alt='Картинка сертификата' />)
                }
            </div>
            <div className={classes.certificateInfoBlock}>
                <div className={classes.certificateInfo}>
                    <h4>{certificate.name}</h4>
                    {isPrototype ? (
                        <span className={classes.certificateDescription}>
                            {certificate.description}
                        </span>
                    ) : (
                        <div className={classes.selectDenomination}>
                            <span>Номинал</span>
                            <div className={classes.denominations}>
                                {certificate.denominations.map((denomination, index) => <span onClick={() => setSelectedDenomination(denomination)} key={index} className={classNames(classes.denomination, { [classes.active]: denomination === selectedDenomination })}>{denomination} ₽</span>)}
                            </div>
                        </div>
                    )}
                    {certificate.type === 'digital' ? (
                        null
                    ) : (
                        <div className={classes.imagesBlock}>
                            {certificate?.images?.map(image => <img src={image} alt='картинка сертификата' onClick={() => setActiveImage(image)} style={{ outline: image === activeImage ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }} />)}
                        </div>
                    )}
                    {isPrototype ? (
                        <HashLink style={{ all: 'unset' }} to='/constructor#certificate'>
                            <Button color='golden'>Выбрать номинал</Button>
                        </HashLink>
                    ) : (
                        <div className={classes.buttonsBlock}>
                            <Button color='golden' onClick={handleAddTocart}>Добавить</Button>
                            {certificate.type === 'physical' ? (
                                <Button color='white' >
                                    <a href="https://www.wildberries.ru/catalog/622369541/detail.aspx?targetUrl=GP" target='_blank' style={{ all: 'unset' }}>
                                        Заказать на Wildberries
                                    </a>
                                </Button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}