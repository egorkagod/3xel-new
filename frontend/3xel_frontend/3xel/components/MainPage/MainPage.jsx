import classes from './MainPage.module.scss'
import MainUpperSection from './MainUpperSection/MainUpperSection'
import Catalogue from './Catalogue/Catalogue'
import CertificatesSection from './CertificatesSection/CertificatesSection'
import HowItWorks from './HowItWorks/HowItWorks'
import AboutSection from './AboutSection/AboutSection'

export default function MainPage() {
    return (
        <main className={classes.main}>
            <MainUpperSection></MainUpperSection>
            <Catalogue></Catalogue>
            <CertificatesSection></CertificatesSection>
            <HowItWorks></HowItWorks>
            <AboutSection></AboutSection>
        </main>
    )
}