import classes from './CDEK.module.scss'
import { useEffect, useRef } from 'react'

export default function CDEK() {
    const rootRef = useRef(null);

    useEffect(() => {
        if (rootRef.current && window.CDEKWidget) {
            new window.CDEKWidget({
                from: 'Москва',
                root: rootRef.current.id, 
                apiKey: '6510b8f8-7dc7-4cd4-a94e-1765017a6ded',
                defaultLocation: 'Москва',
                canChoose: true
            })
        }
    }, [])

    return (
        <div
            id="cdek-map"
            ref={rootRef}
            className={classes.cdekMap}
        />
    )
}
