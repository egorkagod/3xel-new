import classes from './CertificatesSection.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'
import Certificate from '../../Constructor/SelectGood/Certificates/Certificate'
import { useSelector } from 'react-redux'

export default function CertificatesSection() {

    const certificates = useSelector((state) => state.goods.certificates)

    return (
        <section className={classes.certificatesSection} id='certificates'>
            <SectionHeader header='Подарочные сертификаты'>
                Изготовление, упаковка и доставка включены.
            </SectionHeader>
            <div className={classes.certificatesContainer}>
                <Certificate isPrototype={true} certificate={certificates?.[0]}></Certificate>
            </div>
        </section>
    )
}