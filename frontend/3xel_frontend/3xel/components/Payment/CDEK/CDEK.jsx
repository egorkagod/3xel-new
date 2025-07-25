import classes from './CDEK.module.scss'
import { useEffect, useRef } from 'react'

export default function CDEK() {
    const rootRef = useRef(null);

    useEffect(() => {
        if (rootRef.current && window.CDEKWidget) {
            new window.CDEKWidget({
                from: {
                    country_code: 'RU',
                    city: 'Москва',
                    postal_code: '101000',
                    code: '742',
                    address: 'ул. Госпитальная набережная, д. 4с1'
                },
                root: rootRef.current.id, 
                apiKey: '6510b8f8-7dc7-4cd4-a94e-1765017a6ded',
                canChoose: true,
                servicePath: '/service.php',
                lang: 'rus',
                currency: 'RUB',
                defaultLocation: 'Москва'
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
