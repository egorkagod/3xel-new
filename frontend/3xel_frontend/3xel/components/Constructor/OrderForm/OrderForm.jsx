import { useEffect, useMemo, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import classes from './OrderForm.module.scss'
import Button from '../../Button/Button'
import { apiFetch } from '../../../utils/apiClient'
import { uploadFileChunks } from '../../../utils/fileUpload'
import { setIsRepeat, clearCart } from '../../../store/cartSlice'

const MAX_FILE_SIZE = 500 * 1024 * 1024

export default function OrderForm() {
    const location = useLocation()
    const locationState = location.state?.value || null
    const dispatcher = useDispatch()
    const cdekRef = useRef(null)

    const [showFileUploader, setShowFileUploader] = useState(true)
    const [showCdek, setShowCdek] = useState(true)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [selectedTariff, setSelectedTariff] = useState(null)
    const [selectedMode, setSelectedMode] = useState(null)
    const [promoDiscount, setPromoDiscount] = useState(null)

    const cart = useSelector(state => state.cart.items)
    const user = useSelector(state => state.user.data)
    const orders = useSelector(state => state.orders.items)

    useEffect(() => {

        if (!cart.length) {
            setShowCdek(true)
            setShowFileUploader(true)
            return
        }

        const types = cart.map(item => item.type)
        if (types.findIndex(type => type === 'Пластиковый бюст') >= 0 || types.findIndex(type => type === 'Картонный бюст') >= 0) {
            setShowFileUploader(true)
            setShowCdek(true)
        } else {
            setShowFileUploader(false)
            if (types.findIndex(type => type === 'physical') >= 0) {
                setShowCdek(true)
            } else {
                setShowCdek(false)
            }
        }

    }, [cart])

    const widgetRef = useRef(null)
    const cdekGoods = useMemo(() =>
        cart.map(item => ({ width: Number(item.width), height: Number(item.height), length: Number(item.boxLength), weight: Number(item.weight) })),
        [cart]
    )

    useEffect(() => {

        const initWidget = () => {
            if (!cdekRef.current) return
            widgetRef.current = new window.CDEKWidget({
                from: {
                    country_code: "RU",
                    city: "Москва",
                    postal_code: "109518",
                    address: "ул. 2-й Грайвороновский проезд, д. 42к4",
                    code: 44,
                },
                root: 'cdek-map',
                apiKey: "6510b8f8-7dc7-4cd4-a94e-1765017a6ded",
                defaultLocation: "Москва",
                servicePath: 'https://3xel.ru/service.php',
                canChoose: true,
                debug: true,
                lang: "rus",
                currency: "RUB",
                fixBounds: "country",
                tariffs: {
                    office: [136, 234, 779, 62, 483],
                    door: [137, 233],
                    pickup: [368, 378],
                },
                onChoose(mode, tariff, address) {
                    setSelectedAddress(address)
                    setSelectedTariff(tariff)
                    setSelectedMode(mode)
                    setIsCalculating(true)
                    console.log(tariff)
                    console.log(address)
                }
            })
        }

        if (window.CDEKWidget) {
            initWidget()
        }

        return () => {
            try {
                widgetRef.current?.destroy?.()
            } catch { }
            if (cdekRef.current) cdekRef.current.innerHTML = ''
        }

    }, [])

    useEffect(() => {
        if (!widgetRef.current) return

        widgetRef.current.resetParcels()
        cdekGoods.forEach(good => widgetRef.current.addParcel(good))
    }, [cdekGoods])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        setValue,
        control,
        watch,
    } = useForm({
        defaultValues: {
            surname: '',
            name: '',
            patronymic: '',
            phone: '',
            email: '',
            fileLink: '',
            wishes: '',
            instruction: false,
            offer: false,
        },
    })

    const completedOrders = useMemo(
        () => orders.filter(order => order.status === 'Завершен'),
        [orders],
    )
    const goodsCost = useMemo(
        () => cart.reduce((acc, item) => acc + item.cost, 0),
        [cart],
    )
    const resultDiscount = useMemo(() => cart.reduce((acc, item) => acc + item.discount, 0), [cart])

    const resultCost = useMemo(() => Math.ceil(goodsCost - resultDiscount + ((selectedTariff?.delivery_sum ?? 0) * 1.1)),
        [goodsCost, resultDiscount, selectedTariff]
    )

    const isAuthenticated = Boolean(user)

    const options = useMemo(
        () => completedOrders.map(order => ({
            value: order.id,
            label: `Заказ #${String(order.id ?? '')}`,
        })),
        [completedOrders]
    )

    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadedFileId, setUploadedFileId] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadError, setUploadError] = useState(null)
    const [generalError, setGeneralError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setValue('name', user?.first_name, { shouldDirty: false })
        setValue('surname', user?.last_name, { shouldDirty: false })
        setValue('patronymic', user?.patronymic, { shouldDirty: false })
        setValue('email', user?.email || '', { shouldDirty: false })
        setValue('phone', user?.phone || '', { shouldDirty: false })
    }, [user, setValue])

    useEffect(() => {
        if (isAuthenticated) {
            setGeneralError(null)
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (locationState && options.length > 0) {
            const selectedOption = options.find(o => o.value === locationState)
            if (selectedOption) {
                setValue('orderId', selectedOption)
            }
        }
    }, [locationState, options, setValue])

    const selectedOrderId = watch('orderId')

    useEffect(() => {
        if (watch('orderId')) {
            dispatcher(setIsRepeat(true))
        } else {
            dispatcher(setIsRepeat(false))
        }
    }, [dispatcher, selectedOrderId])

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] ?? null

        setUploadProgress(0)
        setUploadError(null)
        setUploadedFileId(null)
        setGeneralError(null)

        if (!file) {
            setSelectedFile(null)
            return
        }

        if (
            !(file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov'))
        ) {
            setSelectedFile(null)
            setError('file', { type: 'manual', message: 'Поддерживаются только видеофайлы (mp4, mov)' })
            event.target.value = ''
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setSelectedFile(null)
            setError('file', { type: 'manual', message: 'Размер файла не должен превышать 500 МБ' })
            event.target.value = ''
            return
        }

        clearErrors('file')
        setSelectedFile(file)
    }

    // const onPromo = async (data) => {
    //     try {
    //         const response = await apiFetch()
    //     } catch {
    //         null
    //     }
    // }

    useEffect(() => {
        if (!showCdek) {
            setSelectedTariff(null)
            setSelectedAddress(null)
        }
    })

    const onSubmit = async (data) => {
        setGeneralError(null)
        const orderId = data.orderId?.value

        if (!isAuthenticated) {
            setGeneralError('Войдите в аккаунт, чтобы оформить заказ.')
            return
        }

        if (!cart.length) {
            setGeneralError('Добавьте хотя бы один товар, чтобы оформить заказ.')
            return
        }

        let fileId = uploadedFileId

        if (!data.name) {
            setGeneralError('Заполните все обязательные поля')
            setError('name', { type: 'manual', message: 'Введите имя' })
            return
        }

        if (!data.surname) {
            setGeneralError('Заполните все обязательные поля')
            setError('surname', { type: 'manual', message: 'Введите фамилию' })
            return
        }

        if (!data.patronymic) {
            setGeneralError('Заполните все обязательные поля')
            setError('patronymic', { type: 'manual', message: 'Введите отчество' })
            return
        }

        if (!data.phone) {
            setGeneralError('Заполните все обязательные поля')
            setError('phone', { type: 'manual', message: 'Введите номер телефона' })
            return
        }

        const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/

        if (!phoneRegex.test(data.phone)) {
            setGeneralError('Введите корректный номер телефона')
            setError('phone', { type: 'manual', message: "Введите корректный номер телефона" })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(data.email)) {
            setGeneralError('Введите корректный email')
            setError('email', { type: 'manual', message: "Введите корректный email" })
            return
        }

        if (!selectedTariff && showCdek) {
            setGeneralError('Выберите адрес и тариф доставки')
            return
        } else {
            setSelectedTariff(null)
            setSelectedAddress(null)
        }

        if (orderId) {
            setGeneralError(null)
            setError('file', null)
        } else {

            if (showFileUploader) {
                if (!fileId && !data.fileLink) {
                    if (!selectedFile) {
                        setError('file', { type: 'manual', message: 'Загрузите видеофайл' })
                        setGeneralError('Прикрепите видеофайл, чтобы продолжить.')
                        return
                    }

                    setIsUploading(true)
                    try {
                        const newFileId = await uploadFileChunks(selectedFile, {
                            onProgress: setUploadProgress,
                        })
                        setUploadedFileId(newFileId)
                        fileId = newFileId
                        setUploadProgress(100)
                        clearErrors('file')
                        setUploadError(null)
                    } catch (error) {
                        const message = error.message || 'Не удалось загрузить видеофайл'
                        setUploadError(message)
                        setGeneralError(message)
                        return
                    } finally {
                        setIsUploading(false)
                    }
                }
            }
        }

        clearErrors('name')
        clearErrors('surname')
        clearErrors('patronymic')
        clearErrors('phone')
        clearErrors('email')
        clearErrors('address')
        setIsSubmitting(true)
        try {
            const payload = {
                goods: cart
                    .filter(item => item.type === 'Пластиковый бюст' || item.type === 'Картонный бюст')
                    .map(item => item.id),
                certificates: cart
                    .filter(item => item.type === 'physical' || item.type === 'digital')
                    .map(item => ({ type: item.type, denomination: item.denomination })),
                video_id: fileId,
                order_id: orderId,
                name: data.name,
                surname: data.surname,
                patronymic: data.patronymic,
                phone: data.phone,
                wishes: data.wishes,
                promocode: data.promocode === '' ? null : data.promocode,
                cdek: showCdek ? {
                    tariff_code: selectedTariff.tariff_code,
                    city_code: selectedAddress.city_code ?? null,
                    city: selectedAddress.city,
                    address: selectedMode === 'office' ? selectedAddress.address : selectedAddress.name,
                } : null
            }
            const response = await apiFetch('/api-order/order/', {
                method: 'POST',
                body: payload,
            })

            if (response?.payment_url) {
                window.location.href = response.payment_url
                dispatcher(clearCart())
            } else {
                setGeneralError('Произошла ошибка при оплате')
            }
        } catch (error) {
            const message = error?.payload?.error || error?.message || 'Не удалось создать заказ'
            setGeneralError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const fileRegister = register('file', {
        onChange: handleFileChange,
    })

    const payButtonLabel = !isAuthenticated
        ? 'Войдите, чтобы оплатить'
        : isUploading
            ? 'Загрузка видео…'
            : (isSubmitting ? 'Создание заказа…' : 'Оплатить')

    return (
        <section className={classes.orderFormSection}>
            <h2>3. Данные получателя и доставка</h2>
            <form className={classes.orderFormBlock} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.orderForm}>
                    <div className={classes.formField}>
                        <label htmlFor="surname">Фамилия *</label>
                        <input type="text" id='surname' placeholder='Введите фамилию' {...register('surname')} />
                        {errors.surname ? (
                            <span className={classes.errorText}>{errors.surname.message}</span>
                        ) : null}

                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="name">Имя *</label>
                        <input type="text" id='name' placeholder='Введите имя' {...register('name')} />
                        {errors.name ? (
                            <span className={classes.errorText}>{errors.name.message}</span>
                        ) : null}
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="patronymic">Отчество *</label>
                        <input type="text" id='patronymic' placeholder='Введите отчество' {...register('patronymic')} />
                        {errors.patronymic ? (
                            <span className={classes.errorText}>{errors.patronymic.message}</span>
                        ) : null}
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="phone">Телефон *</label>
                        <input type="tel" id='phone' placeholder='+7 (___) ___-__-__' {...register('phone')} />
                        {errors.phone ? (
                            <span className={classes.errorText}>{errors.phone.message}</span>
                        ) : null}
                    </div>
                    <div className={classes.formField} style={{ alignSelf: 'start' }}>
                        <label htmlFor="email">E-mail *</label>
                        <input type="email" id='email' placeholder='Введите email' {...register('email')} />
                        {errors.email ? (
                            <span className={classes.errorText}>{errors.email.message}</span>
                        ) : null}
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="promocode">Промокод</label>
                        <input type="text" id='promocode' placeholder='Введите промокод' {...register('promocode')} />
                        <Button type='button' color='golden'>Применить</Button>
                    </div>
                    <div className={classes.formField}>
                        {watch('orderId') ? (
                            <span className={classes.attention}>Обратите внимание! При повторном заказе будет использоваться видео, которое вы прикрепляли в первый раз!</span>
                        ) : (
                            showFileUploader ? (
                                <>
                                    <label htmlFor="file">Загрузка видео (ссылка или файл) *</label>
                                    <input type="text" id='fileLink' placeholder='Ссылка на Google Drive / Yandex Disk' {...register('fileLink')} />
                                    <label className={classes.fileUploader}>
                                        <span>Перетащите или выберите видеофайл</span>
                                        <input
                                            type="file"
                                            id='video-file'
                                            accept="video/*,video/quicktime,.mov"
                                            {...fileRegister}
                                        />
                                    </label>
                                </>
                            ) : (
                                null
                            )
                        )}
                        {selectedFile ? (
                            <div className={classes.uploadStatus}>
                                <span>{selectedFile.name}</span>
                                {uploadedFileId ? (
                                    <span className={classes.successText}>Файл загружен</span>
                                ) : isUploading ? (
                                    <span>Загрузка: {uploadProgress}%</span>
                                ) : uploadProgress > 0 ? (
                                    <span>Подготовлено: {uploadProgress}%</span>
                                ) : null}
                            </div>
                        ) : null}
                        {errors.file ? (
                            <span className={classes.errorText}>{errors.file.message}</span>
                        ) : null}
                        {uploadError ? (
                            <span className={classes.errorText}>{uploadError}</span>
                        ) : null}
                    </div>
                    <div className={classes.formField} style={{ display: showCdek ? 'flex' : 'none' }}>
                        <div id="cdek-map" ref={cdekRef} className={classes.cdek}></div>
                        {selectedAddress ? (
                            <>
                                <span>Выбранный адрес доставки: {selectedMode ? (
                                    selectedMode == 'office' ? 'Пункт выдачи —' : null
                                ) : null} <b>{selectedMode === 'office' ? selectedAddress.name : selectedAddress.formatted}</b></span>
                                <span className={classes.attention}>Срок доставки указан без учета срока изготовления изделия!</span>
                            </>

                        ) : null}
                        {errors.address ? (
                            <span className={classes.errorText}>{errors.address.message}</span>
                        ) : null}
                    </div>
                    <div className={classes.formField}>
                        <label>Повторный заказ</label>
                        <div className={classes.select} id='select'>
                            <Controller
                                name='orderId'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder='Выберите номер прошлого заказа'
                                        options={options}
                                        {...field}
                                        value={field.value}
                                        onChange={(selected) => {
                                            field.onChange(selected)
                                        }}
                                        isClearable
                                    ></Select>
                                )}
                            />

                        </div>
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor='wishes'>Комментарий</label>
                        <textarea name="Wishes" id="wishes" rows={5} placeholder='Введите ваши пожелания' {...register('wishes')}></textarea>
                    </div>
                    <div className={classes.checkboxFields}>
                        <div className={classes.field}>
                            <input type="checkbox" id='instruction' {...register('instruction')} required />
                            <label htmlFor="instruction">С инструкцией по съемке видео ознакомился(-ась) * — <Link to='/instruction' style={{ cursor: 'pointer' }}>как снять видео</Link></label>
                        </div>
                        <div className={classes.field}>
                            <input type="checkbox" id='offer' {...register('offer')} required />
                            <label htmlFor="offer">С <a href="/files/Публичная_оферта_интернет_магазин_изготовления_бюстов_1.pdf" target='_blank'>офертой</a> ознакомился(-ась) *</label>
                        </div>
                    </div>

                </div>

                <div className={classes.resultBlock}>
                    <div className={classes.resultCost}>
                        <strong>Итого:</strong>
                        <span className={classes.result}>{resultCost} ₽ (Включая доставку: {(selectedTariff?.delivery_sum ?? 0)} ₽ + 10% НДС)</span>
                    </div>
                    <span className={classes.goodsCost}>
                        {resultDiscount === 0 ? (
                            <>
                                Товары: {goodsCost} ₽ (скидка 0 ₽)
                            </>
                        ) : (
                            <>
                                Товары: <s>{goodsCost} ₽</s> → <b>{goodsCost - resultDiscount} ₽</b> (скидка {resultDiscount} ₽)
                            </>
                        )}
                    </span>
                    {generalError ? (
                        <span className={classes.errorText}>{generalError}</span>
                    ) : null}
                    <Button
                        color='golden'
                        type='submit'
                        disabled={isUploading || isSubmitting || !isAuthenticated}
                    >
                        {payButtonLabel}
                    </Button>
                </div>

                <span style={{ fontSize: '12px', color: '#83828bff' }}>* - обязательное поле</span>
            </form>
        </section>
    )
}
