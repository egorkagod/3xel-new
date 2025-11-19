import classes from './Certificate.module.scss'
import Button from '../../../Button/Button'
import PopUp from '../../../PopUp/PopUp'
import classNames from 'classnames'
import { useState } from 'react'
import { addToCart } from '../../../../store/cartSlice'
import { useDispatch } from 'react-redux'
import certificate1 from '/3xel_images/certificate1.png'
import certificate2 from '/3xel_images/certificate2.png'
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
            length: certificate.boxLength ? certificate.length : null,
            width: certificate.width ? certificate.width : null,
            height: certificate.height ? certificate.height : null,
            weight: certificate.weight ? certificate.weight : null
        }))
        setPopupIsActive(true)
        setTimeout(() => setPopupIsActive(false), 3000)
    }

    const images = [
        certificate1,
        certificate2,
    ]

    const [activeImage, setActiveImage] = useState(certificate1)

    return (
        <div className={classes.certificate} id={id}>
            <PopUp isActive={popupIsActive}>Товар добавлен в конструктор</PopUp>
            <div className={classes.instructionContainer}>
                {certificate.type === 'digital' ? (
                    <p>
                        Как воспользоваться электронным сертификатом: <br />
                        <br />
                        — Добавьте в корзину изделия, которые хотите приобрести <br />
                        — Введите и примените промокод, который мы выслали вам на почту <br />
                        — Совершите заказ, прикрепив видео для создания вашего уникального бюста <br />
                    </p>
                ) : (
                    images.map(image => <img src={image} alt='certificate photo' className={classNames(classes.image, { [classes.active]: image === activeImage })} />)
                )}
            </div>
            <div className={classes.certificateInfoBlock}>
                <div className={classes.denominationsList}>
                    {certificate.denominations.map((denomination, index) => <span key={index}>{denomination} ₽</span>)}
                </div>
                <div className={classes.certificateInfo}>
                    {isPrototype ? (
                        <span className={classes.certificateType}>Подарочный сертификат</span>
                    ) : null}
                    <h4>{certificate.name}</h4>
                    {isPrototype ? (
                        <span className={classes.certificateDescription}>
                            Если хотите сделать сюрприз, но не знаете, какое видео или формат выбрать — дарите сертификат. <br />
                            — Электронный или печатный формат <br />
                            — Получатель сам загружает видео и выбирает тип бюста <br />
                            — Отлично подходит для дней рождения, юбилеев и корпоративных подарков
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
                            {images.map(image => <img src={image} alt='certificate photo' onClick={() => setActiveImage(image)} style={{ outline: image === activeImage ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }} />)}
                        </div>
                    )}
                    {isPrototype ? (
                        <HashLink style={{ all: 'unset' }} to='/constructor#certificate'>
                            <Button color='golden'>Выбрать номинал</Button>
                        </HashLink>
                    ) : (
                        <Button color='golden' onClick={handleAddTocart}>Добавить</Button>
                    )}
                </div>
            </div>
        </div>
    )
}