import classes from './OrderForm.module.scss'
import { useForm } from 'react-hook-form'
import Button from '../../Button/Button'
import Select from 'react-select'
import { useSelector } from 'react-redux'

export default function OrderForm() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const cart = useSelector(state => state.cart)
    const resultCost = cart.reduce((acc, item) => acc + item.cost, 0)

    return (
        <section className={classes.orderFormSection}>
            <h2>3. Данные получателя и доставка</h2>
            <form className={classes.orderFormBlock} onSubmit={handleSubmit}>
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
                        <input type="phone" id='phone' placeholder='+7 (___) ___-__-__' {...register('phone')} />
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
                        <Button>Рассчитать доставку</Button>
                        <span>Выберите ПВЗ СДЭК и нажмите на кнопку — стоимость доставки подставится автоматически.</span>
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor="file">Загрузка видео (ссылка или файл)</label>
                        <input type="text" id='file' placeholder='Ссылка на Google Drive / Yandex Disk' {...register('fileLink')} />
                        <label className={classes.fileUploader}>
                            <span>Перетащите или выберите видеофайл</span>
                            <input type="file" id='file' {...register('file')} />
                        </label>
                    </div>
                    <div className={classes.formField}>
                        <label>Повторный заказ</label>
                        <div className={classes.select}>
                            <Select
                                placeholder='Выберите номер прошлого заказа'
                            ></Select>
                        </div>
                    </div>
                    <div className={classes.formField}>
                        <label htmlFor='wishes'>Комментарий</label>
                        <textarea name="Wishes" id="wishes" placeholder='Введите ваши пожелания' {...register('wishes')}></textarea>
                    </div>
                    <div className={classes.checkboxFields}>
                        <div className={classes.field}>
                            <input type="checkbox" id='instruction' {...register('instruction')} />
                            <label htmlFor="instruction">С инструкцией по съемке видео ознакомился(-ась) — как снять видео</label>
                        </div>
                        <div className={classes.field}>
                            <input type="checkbox" id='offer' {...register('offer')} />
                            <label htmlFor="offer">С офертой ознакомился(-ась)</label>
                        </div>
                    </div>

                </div>

                <div className={classes.resultBlock}>
                    <div className={classes.resultCost}>
                        <strong>Итого:</strong>
                        <span className={classes.result}>{resultCost} ₽ (Включая доставку: 0 ₽)</span>
                    </div>
                    <span className={classes.goodsCost}>Товары: {resultCost} ₽ (скидка 0 ₽)</span>
                    <Button color='golden' type='button'>Оплатить</Button>
                </div>
            </form>
        </section>
    )
}