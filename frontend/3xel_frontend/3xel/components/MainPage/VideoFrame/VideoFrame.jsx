import classes from './VideoFrame.module.scss'
import backgroundVideo from '../../../public/images/background-video.mp4'
import { useState, useEffect } from 'react'

export default function VideoFrame() {

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {

        const handleResize = () => setWidth(window.innerWidth)

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [width])

    return (
        <div className={classes.globalContainer}>
            {
                width >= 1024 ? (
                    <video autoPlay muted playsInline loop>
                        <source src={backgroundVideo} />
                    </video>
                ) : null
            }

        </div>
    )
}