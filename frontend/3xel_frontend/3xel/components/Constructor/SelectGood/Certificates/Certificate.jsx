import classes from './Certificate.module.scss'
import Button from '../../../Button/Button'
import PopUp from '../../../PopUp/PopUp'
import classNames from 'classnames'
import { useState } from 'react'
import { addToCart } from '../../../../store/cartSlice'
import { useDispatch } from 'react-redux'

export default function Certificate({ certificate, id }) {

    const dispatcher = useDispatch()
    const [selectedDenomination, setSelectedDenomination] = useState(certificate.denominations ? certificate.denominations[0] : null)
    const [popupIsActive, setPopupIsActive] = useState(false)

    const handleAddTocart = () => {
        dispatcher(addToCart({id: certificate.id, name: certificate.name, denomination: selectedDenomination, cost: selectedDenomination}))
        setPopupIsActive(true)
        setTimeout(() => setPopupIsActive(false), 3000)
    }

    return (
        <div className={classes.certificate} id={id}>
            <PopUp isActive={popupIsActive}>Товар добавлен в конструктор</PopUp>
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
                <Button color='golden' onClick={handleAddTocart}>Добавить</Button>
            </div>
        </div>
    )
}