import classes from './Certificate.module.scss'
import Button from '../../../Button/Button'
import PopUp from '../../../PopUp/PopUp'
import classNames from 'classnames'
import { useState } from 'react'
import { addToCart } from '../../../../store/cartSlice'
import { useDispatch } from 'react-redux'
import certificate1 from '/3xel_images/certificate1.png'
import certificate2 from '/3xel_images/certificate2.png'

export default function Certificate({ certificate, id }) {

    const dispatcher = useDispatch()
    const [selectedDenomination, setSelectedDenomination] = useState(certificate.denominations ? certificate.denominations[0] : null)
    const [popupIsActive, setPopupIsActive] = useState(false)

    const handleAddTocart = () => {
        dispatcher(addToCart({ id: certificate.id, name: certificate.name, denomination: selectedDenomination, cost: selectedDenomination }))
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
            <div className={classes.imageContainer}>
                {images.map(image => <img src={image} alt='certificate photo' className={classNames(classes.image, {[classes.active] : image === activeImage})} />)}
            </div>
            <div className={classes.certificateInfoBlock}>
                <div className={classes.denominationsList}>
                    {certificate.denominations.map((denomination, index) => <span key={index}>{denomination} ₽</span>)}
                </div>
                <div className={classes.certificateInfo}>
                    <h4>{certificate.name}</h4>
                    <div className={classes.selectDenomination}>
                        <span>Номинал</span>
                        <div className={classes.denominations}>
                            {certificate.denominations.map((denomination, index) => <span onClick={() => setSelectedDenomination(denomination)} key={index} className={classNames(classes.denomination, { [classes.active]: denomination === selectedDenomination })}>{denomination} ₽</span>)}
                        </div>
                    </div>
                    <div className={classes.imagesBlock}>
                        {images.map(image => <img src={image} alt='certificate photo' onClick={() => setActiveImage(image)} style={{ outline: image === activeImage ? '4px solid rgba(216, 185, 138, 0.65)' : 'none' }} />)}
                    </div>
                    <Button color='golden' onClick={handleAddTocart}>Добавить</Button>
                </div>
            </div>
        </div>
    )
}