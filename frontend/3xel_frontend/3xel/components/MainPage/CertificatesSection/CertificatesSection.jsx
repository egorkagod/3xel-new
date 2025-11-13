import classes from './CertificatesSection.module.scss'
import SectionHeader from '../../SectionHeader/SectionHeader'
import Certificate from '../../Constructor/SelectGood/Certificates/Certificate'

export default function CertificatesSection() {
    return (
        <section className={classes.certificatesSection} id='certificates'>
            <SectionHeader header='Подарочные сертификаты'>
                Изготовление, упаковка и доставка включены.
            </SectionHeader>
            <div className={classes.certificatesContainer}>
                <Certificate isPrototype={true}></Certificate>
            </div>
        </section>
    )
}