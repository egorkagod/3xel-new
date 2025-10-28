import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classes from './OrderForm.module.scss'
import Button from '../../Button/Button'
import { apiFetch } from '../../../utils/apiClient'
import { uploadFileChunks } from '../../../utils/fileUpload'

const MAX_FILE_SIZE = 500 * 1024 * 1024

export default function OrderForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        setValue,
        control,
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

    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.user.data)
    const orders = useSelector(state => state.orders.items)
    const completedOrders = useMemo(
        () => orders.filter(order => order.status === 'Завершен'),
        [orders],
    )
    const resultCost = useMemo(
        () => cart.reduce((acc, item) => acc + item.cost, 0),
        [cart],
    )
    const resultDiscount = useMemo(() => cart.reduce((acc, item) => acc + item.discount, 0), [cart])

    const isAuthenticated = Boolean(user)

    const options = useMemo(
        () => completedOrders.map(order => {
            return { value: order.id, label: `Заказ #${order.id.split('-')[0]}` }
        }),
        [completedOrders]
    )

    const [selectedOrder, setSelectedOrder] = useState(null)

    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadedFileId, setUploadedFileId] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadError, setUploadError] = useState(null)
    const [generalError, setGeneralError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setValue('name', user?.first_name || '', { shouldDirty: false })
        setValue('email', user?.email || '', { shouldDirty: false })
    }, [user, setValue])

    useEffect(() => {
        if (isAuthenticated) {
            setGeneralError(null)
        }
    }, [isAuthenticated])

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

        if (!file.type.startsWith('video/')) {
            setSelectedFile(null)
            setError('file', { type: 'manual', message: 'Поддерживаются только видеофайлы' })
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

    const onSubmit = async () => {
        setGeneralError(null)


        if (!isAuthenticated) {
            setGeneralError('Войдите в аккаунт, чтобы оформить заказ.')
            return
        }

        if (!cart.length) {
            setGeneralError('Добавьте хотя бы один товар, чтобы оформить заказ.')
            return
        }

        if (selectedOrder) {
            let orderId = selectedOrder
        } else {
            let fileId = uploadedFileId

            if (!fileId) {
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


        setIsSubmitting(true)
        try {
            const payload = {
                goods: cart.map(item => item.id),
                video_id: fileId,
                order_id: orderId,
            }
            const response = await apiFetch('/api-order/order/', {
                method: 'POST',
                body: payload,
            })

            if (response?.payment_url) {
                window.location.href = response.payment_url
            } else {
                setGeneralError('Сервер не вернул ссылку на оплату')
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
                        <label htmlFor="surname">Фамилия</label>
                        <input type="text" id='surname' placeholder='Введите фамилию' {...register('surname')} />
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="name">Имя</label>
                        <input type="text" id='name' placeholder='Введите имя' {...register('name')} />
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="patronymic">Отчество</label>
                        <input type="text" id='patronymic' placeholder='Введите отчество' {...register('patronymic')} />
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="phone">Телефон</label>
                        <input type="tel" id='phone' placeholder='+7 (___) ___-__-__' {...register('phone')} />
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id='email' placeholder='Введите email' {...register('email')} />
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="address">Адрес ПВЗ СДЭК</label>
                        <input type="text" id='address' placeholder='Город, улица, номер ПВЗ' />
                    </div>
                    <div className={classes.calcDelivery}>
                        <Button type='button'>Рассчитать доставку</Button>
                        <span>Выберите ПВЗ СДЭК и нажмите на кнопку — стоимость доставки подставится автоматически.</span>
                    </div>
                    <div className={classes.formField}>
                        {selectedOrder ? (
                            <span className={classes.attention}>Обратите внимание! При повторном заказе будет использоваться видео, которое вы прикрепляли в первый раз!</span>
                        ) : (
                            <>
                                <label htmlFor="file">Загрузка видео (ссылка или файл)</label>
                                <input type="text" id='fileLink' placeholder='Ссылка на Google Drive / Yandex Disk' {...register('fileLink')} />
                                <label className={classes.fileUploader}>
                                    <span>Перетащите или выберите видеофайл</span>
                                    <input
                                        type="file"
                                        id='video-file'
                                        accept='video/*'
                                        {...fileRegister}
                                    />
                                </label>
                            </>
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
                    <div className={classes.formField}>
                        <label>Повторный заказ</label>
                        <div className={classes.select}>
                            <Controller
                                name='orderId'
                                control={control}
                                render={({ field }) => {
                                    <Select
                                        placeholder='Выберите номер прошлого заказа'
                                        options={options}
                                        {...field}
                                        value={selectedOrder?.value || null}
                                        onChange={(selected) => {
                                            field.onChange(selected?.value || null)
                                            setSelectedOrder(selected?.value || null)
                                            console.log(selected?.value || null)
                                        }}
                                    ></Select>
                                }}
                            />

                        </div>
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor='wishes'>Комментарий</label>
                        <textarea name="Wishes" id="wishes" placeholder='Введите ваши пожелания' {...register('wishes')}></textarea>
                    </div>
                    <div className={classes.checkboxFields}>
                        <div className={classes.field}>
                            <input type="checkbox" id='instruction' {...register('instruction')} />
                            <label htmlFor="instruction">С инструкцией по съемке видео ознакомился(-ась) — <Link to='/instruction' style={{ cursor: 'pointer' }}>как снять видео</Link></label>
                        </div>
                        <div className={classes.field}>
                            <input type="checkbox" id='offer' {...register('offer')} />
                            <label htmlFor="offer">С <a href="/files/offer_3xel.pdf" target='_blank'>офертой</a> ознакомился(-ась)</label>
                        </div>
                    </div>

                </div>

                <div className={classes.resultBlock}>
                    <div className={classes.resultCost}>
                        <strong>Итого:</strong>
                        <span className={classes.result}>{resultCost - resultDiscount} ₽ (Включая доставку: 0 ₽)</span>
                    </div>
                    <span className={classes.goodsCost}>
                        {resultDiscount === 0 ? (
                            <>
                                Товары: {resultCost} ₽ (скидка 0 ₽)
                            </>
                        ) : (
                            <>
                                Товары: <s>{resultCost} ₽</s> → <b>{resultCost - resultDiscount} ₽</b> (скидка {resultDiscount} ₽)
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
            </form>
        </section>
    )
}
