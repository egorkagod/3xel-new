import classes from './MainPage.module.scss'
import VideoFrame from './VideoFrame/VideoFrame'
import MainSection from './MainSection/MainSection'
import Slider from './MainSection/Slider/Slider'

export default function MainPage() {
    return(
        <main className={classes.globalContainer}>
            <VideoFrame></VideoFrame>
            <MainSection></MainSection>
            <Slider></Slider>
        </main>
    )
}