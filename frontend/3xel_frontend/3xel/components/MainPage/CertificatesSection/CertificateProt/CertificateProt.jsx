import classes from './CertificateProt.module.scss'
import Button from '../../../Button/Button'
import { HashLink } from 'react-router-hash-link'

export default function CertificateProt() {
    return (
        <div className={classes.certificatePrototype}>
            <div className={classes.denominations}>
                <span>5 500 ₽</span>
                <span>6 500 ₽</span>
                <span>7 500 ₽</span>
                <span>8 500 ₽</span>
                <span>9 500 ₽</span>
            </div>
            <div className={classes.certificateInfo}>
                <span className={classes.certificateType}>Подарочный сертификат</span>
                <h4 className={classes.certificateName}>Сертификат на бюст</h4>
                <span className={classes.certificateDescription}>Выберите номинал — всё включено: изготовление и доставка.</span>
                <HashLink style={{ all: 'unset' }} to='/constructor#certificate'>
                    <Button color='golden'>Выбрать номинал</Button>
                </HashLink>
            </div>
        </div>
    )
}