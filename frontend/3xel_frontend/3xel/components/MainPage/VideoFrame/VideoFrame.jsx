import classes from './VideoFrame.module.scss'
import backgroundVideo from '../../../public/images/background-video.mp4'

export default function VideoFrame() {
    return(
        <div className={classes.globalContainer}>
            <video autoPlay muted playsInline loop>
                <source src={backgroundVideo} />
            </video>
        </div>
    )
}