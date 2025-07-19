import classes from './Modal.module.scss'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Select from 'react-select'
import { useState } from 'react'

export default function Modal({ modalHeader, btn1, btn2, isActive, onClick, isEditModal, onAction }) {

    const options = [
        {
            label: 'Почта',
            value: 'email'
        },
        {
            label: 'Пароль',
            value: 'password'
        }
    ]

    const [selectedOption, setSelectedOption] = useState(options[0])

    return ReactDOM.createPortal(
        <div className={classNames(classes.overlay, { [classes.active]: isActive })}>
            <div className={classes.modal}>
                <span className={classes.modalHeader}>{modalHeader}</span>
                {isEditModal ? (
                    <>
                        <div style={{ width: '100%' }}>
                            <Select
                                styles={{ width: '100%' }}
                                placeholder='Выберите опцию'
                                options={options}
                                onChange={setSelectedOption}
                                value={selectedOption}
                            ></Select>
                        </div>
                        {selectedOption?.value === 'email' ? (
                            <div style={{ width: '100%' }}>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <span style={{ color: 'black' }}>Текущая почта: alipkin9820@gmail.com</span>
                                    <input className={classes.input} type="email" name='email' placeholder='Новая почта' autoComplete='email' />
                                </form>
                            </div>
                        ) : (
                            <div>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <input type="password" name='current_password' className={classes.input} placeholder='Введите текущий пароль' />
                                    <input type="password" name='new_password' className={classes.input} placeholder='Придумайте новый пароль' />
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    null
                )}
                <div className={classes.btnContainer}>
                    <button className={isEditModal ? classes.editBtn : classes.actionBtn} onClick={onAction}>{btn1}</button>
                    <button className={classes.closeBtn} onClick={onClick}>{btn2}</button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    )
}