import classes from './PaymentIntegration.module.scss'
import { useRef, useEffect } from 'react'

export default function PaymentForm({ amount }) {

  const iframeContainer = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://acq-paymentform-integrationjs.t-static.ru/integration.js'
    script.async = true

    const initConfig = {
      terminalKey: '1749568290248DEMO',
      product: 'eacq',
      amount,
      features: {
        iframe: {
          container: iframeContainer.current,
        }
      }
    }

    script.onload = () => {
      window.PaymentIntegration.init(initConfig)
        .then(() => {
          console.log('Форма инициализирована')
        })
        .catch((error) => {
          console.error('Ошибка инициализации:', error)
        })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }

  }, [])



  return (
    <div ref={iframeContainer} id='paymentContainer'>

    </div >
  )
}