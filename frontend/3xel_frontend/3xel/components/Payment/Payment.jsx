import classes from './Payment.module.scss'
import { useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import retryIcon from '/images/retry-icon.png'
import fileIcon from '/images/file-icon.png'
import successIcon from '/images/success-icon.png'
import deleteIcon from '/images/cart-delete-btn.png'
import toMainArrowIcon from '/images/arrow-to-main.png'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { getCookie } from '../../utils/cookie'
import CDEK from './CDEK/CDEK'

export default function Payment() {
    const csrfToken = getCookie('csrftoken')
    const orderItems = useSelector((state) => state.cart.items)
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState(null)
    const [progress, setProgress] = useState(0)
    const [showButton, setShowButton] = useState(false)
    const [showInput, setShowInput] = useState(true)
    const navigate = useNavigate()
    const [id, setId] = useState(null)
    const [redirectURL, setRedirectURL] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const goodsId = orderItems.map(good => good.id)
    const amount = orderItems.reduce((acc, item) => acc + item.cost, 0)

    const fileRef = useRef(null)
    const lastUploadedChunkRef = useRef(0)
    const fileIdRef = useRef(Math.floor(Math.random() * 10 ** 5))
    const fileInputRef = useRef(null)

    const CHUNK_SIZE = 1 * 1024 * 1024
    const MAX_ATTEMPTS = 3

    const handleDrop = async (event, startChunkIndex = 0) => {
        event.preventDefault()

        if (event.dataTransfer?.files?.[0]) {
            fileRef.current = event.dataTransfer.files[0]
            fileIdRef.current = Math.floor(Math.random() * 10 ** 5)
            lastUploadedChunkRef.current = 0
        }

        const file = fileRef.current
        const chars = file.name.split('.')
        const format = '.' + chars[chars.length - 1]
        if (!file) return

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

        setUploading(true)
        setShowInput(false)
        setStatus('Загрузка...')

        for (let chunkIndex = startChunkIndex; chunkIndex < totalChunks; chunkIndex++) {
            const chunk = file.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE)
            const formData = new FormData()
            formData.append('chunk', chunk)
            formData.append('chunkIndex', chunkIndex)
            formData.append('totalChunks', totalChunks)
            formData.append('fileId', fileIdRef.current)
            formData.append('format', format)

            let success = false

            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                try {
                    const response = await fetch('/api-file/upload/', {
                        headers: {
                            'X-CSRFToken': csrfToken,
                        },
                        credentials: 'include',
                        method: 'POST',
                        body: formData,
                    })

                    if (!response.ok) throw new Error('Ошибка сервера')

                    success = true
                    lastUploadedChunkRef.current = chunkIndex + 1
                    setProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100))

                    if (chunkIndex === totalChunks - 1) {
                        const data = await response.json()
                        setId(data.file_id)
                    }
                    break
                } catch (err) {
                    if (attempt < MAX_ATTEMPTS - 1) {
                        await new Promise((res) => setTimeout(res, 1000))
                    }
                }
            }

            if (!success) {
                setStatus(`Ошибка при загрузке файла ${fileRef.current.name}`)
                setUploading(false)
                setShowButton(true)
                return
            }
        }

        setStatus(`Файл ${fileRef.current.name} загружен`)
        setUploading(false)
    }

    const retryUpload = () => {
        setShowButton(false)
        handleDrop(new Event('retry'), lastUploadedChunkRef.current)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const clearFiles = () => {
        setShowInput(true)
        setProgress(0)
        setShowButton(false)
        setStatus('')
        setUploading(false)
        fileInputRef.current.value = ''
        fileRef.current = null
        fileIdRef.current = null
    }

    const toPay = async () => {
        if (id) {
            try {
                setIsLoading(true)
                const response = await fetch('/api-order/create/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify({ video_id: id, goods: goodsId, amount }),
                })

                if (!response.ok) throw new Error('Произошла ошибка при оплате')

                const data = await response.json()

                window.location.href = data.payment_url
            } catch (err) {
                toast.error(err.message)
            } finally {
                setIsLoading(false)
            }
        } else {
            toast.error('Для оплаты необходимо прикрепить видео')
        }

    }

    return (
        <main className={classes.globalContainer}>
            <button className={classes.toMainBtn} onClick={() => navigate('/catalogue')}><img src={toMainArrowIcon} alt="arrow" style={{ width: '30px', height: '30px' }} />В каталог</button>
            <section className={classes.leftSide}>
                <div className={classes.paymentBlock}>
                    <div className={classes.contactBlock}>
                        <h3>Контактный Email</h3>
                        <input type="email" placeholder="Email" name="email" autoComplete="email" />
                    </div>
                    <div className={classes.goodsBlock}>
                        <h3>Товары в корзине:</h3>
                        {orderItems.map((item, index) => (
                            <div key={index} className={classes.item}>
                                <div
                                    className={classes.productImage}
                                    style={{
                                        backgroundImage: `url(${item.background})`,
                                        borderRadius: '6px',
                                        width: '100px',
                                        height: '100px',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}
                                ></div>
                                <div className={classes.goodInfo}>
                                    <div className={classes.goodTitle}>
                                        <span>{item.title}</span>
                                    </div>
                                    <div className={classes.goodProperties}>
                                        <span style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            Цвет:
                                            <div
                                                style={{
                                                    borderRadius: '50%',
                                                    backgroundColor: item.selectedColor,
                                                    width: '20px',
                                                    height: '20px',
                                                    border: '2px solid grey',
                                                }}
                                            ></div>
                                        </span>
                                        <span>Размер: {item.selectedSize}</span>
                                        <span>Стоимость: {item.cost} руб.</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={classes.videoBlock}>
                    <div className={classes.instructionsBlock}>
                        <h3>Инструкция по съемке видео</h3>
                        <p>
                            Для изготовления фигурки объекта необходимо прикрепить видео, ниже приведено подробное руководство по его съемке.
                        </p><br />
                        <p>
                            <b>Обратите внимание, если качество видео будет плохим, вас попросят переснять его.</b><br />
                        </p>
                        <h3 style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '5px' }}><img src="/images/tool.png" alt="tool" />Настройки перед съемкой</h3>
                        <span>1. Качество видео:</span><br />
                        <span>- <b>Лучший вариант:</b> 4K, 60 кадров/секунду.</span><br />
                        <span>- <b>Минимум:</b> 1080p, 60 кадров/секунду.</span><br />
                        <span>2. Подготовка:</span><br />
                        <span>- <b>Протрите камеру</b> - убедитесь, что объектив чистый.</span><br />
                        <span>- <b>Выберите просторное место</b> - вам нужно свободно обходить объект по кругу.</span><br />
                        <h3 style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '5px' }}><img src="/images/cam.png" alt="cam" />Как снимать</h3>
                        <span>1. Основные правила:</span><br />
                        <span>- <b>Одно видео - один объект</b> (не останавливайте запись при смене угла).</span><br />
                        <span><b>Двигайтесь плавно</b> вокруг объекта.</span><br />
                        <span>2. Три этапа съемки:</span><br />
                        <span>- <b>Первый оборот (низкий угол)</b>: снимайте внизу под углом; держите камеру на одной высоте.</span><br />
                        <span>- <b>Второй оборот (средний угол)</b>: поднимите камеру на <b>30 градусов</b>; сделайте еще один полный оборот.</span><br />
                        <span>- <b>Третий оборот (высокий угол)</b>: поднимите камеру еще на <b>30 градусов</b>; завершите съемку.</span><br />
                        <span><b>Важно!</b> Не прерывайте запись, даже если видео получается длинным.</span>
                        <h3 style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '5px' }}><img src="/images/bulb.png" alt="bulb" />Советы</h3>
                        <span>1. Что улучшит качество:</span><br />
                        <span>- Проверьте ракурсы перед съемкой.</span><br />
                        <span>- Используйте равномерное освещение.</span><br />
                        <span>2. Чего избегать:</span><br />
                        <span>- Резких движений камеры.</span><br />
                        <span>- Отражений (зеркал, стекол).</span><br />
                        <span>- Затемненных или пересвеченных участков.</span><br />
                    </div>

                    <div className={classes.attachmentBlock}>
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            style={{
                                border: '2px dashed #888',
                                borderRadius: '10px',
                                padding: '40px',
                                textAlign: 'center',
                                color: '#444',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%'
                            }}
                        >
                            <h3 style={{ display: showInput ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}><img src={fileIcon} alt="file" style={{ width: '50px', height: '50px' }} />Перетащите или <button className={classes.addFileBtn} onClick={() => fileInputRef.current?.click()}>выберите файл</button></h3>
                            <input type="file" onChange={(e) => {
                                const fakeEvent = {
                                    preventDefault: () => { },
                                    dataTransfer: {
                                        files: e.target.files,
                                    },
                                }

                                handleDrop(fakeEvent)
                            }} ref={fileInputRef} style={{ display: 'none' }} accept='.mp4, .webm' />
                            {uploading && <p>Загрузка: {progress}%</p>}
                            {!uploading && status && <div style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '2px solid black', borderRadius: '6px', gap: '5px' }}>
                                <button style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRight: '1px solid black' }} onClick={clearFiles}><img style={{ width: '25px', height: '25px' }} src={deleteIcon} alt="delete" /></button>
                                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>{status}</p>
                            </div>}
                            {showButton && <button onClick={retryUpload} className={classes.retryButton}><img src={retryIcon} alt="retry" />Попробовать снова</button>}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '6px',
                        alignItems: 'center',
                    }}
                >
                    <span>Количество товаров: {orderItems.length} шт.</span>
                    <div style={{ width: '80%', height: '1px', backgroundColor: 'black' }}></div>
                    <span>Вес товаров: 200 гр.</span>
                    <div style={{ width: '80%', height: '1px', backgroundColor: 'black' }}></div>
                    <span>
                        Стоимость товаров: {orderItems.reduce((acc, item) => acc + item.cost, 0)} руб.
                    </span>
                    <div style={{ width: '80%', height: '1px', backgroundColor: 'black' }}></div>
                    <span>Стоимость доставки: 0 руб.</span>
                    <div style={{ width: '80%', height: '1px', backgroundColor: 'black' }}></div>
                    <span>
                        Общая стоимость: {orderItems.reduce((acc, item) => acc + item.cost, 0)} руб.
                    </span>

                    <button className={classes.toPayBtn} onClick={toPay}>
                        {
                            isLoading ? <span>Загрузка...</span> : (
                                <span>Оплата</span>
                            )
                        }
                    </button>
                </div>
            </section>

            <section className={classes.rightSide}>
                <CDEK></CDEK>
            </section>
        </main>
    )
}