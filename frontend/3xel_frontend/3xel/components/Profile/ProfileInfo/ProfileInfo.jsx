import classes from './ProfileInfo.module.scss'
import editIcon from '/images/edit-icon.png'
import Modal from './Modal/Modal'
import { useState } from 'react'

export default function ProfileInfo() {

    const [editModalIsActive, setEditModalIsActive] = useState(false)
    

    return (
        <div className={classes.globalContainer}>
            <div>
                <span className={classes.dataHeader}>Имя:</span>
                <span className={classes.data}>Сергей</span>
            </div>
            <div>
                <span className={classes.dataHeader}>Почта:</span>
                <span className={classes.data}>alipkin9820@gmail.com</span>
            </div>
            <div style={{width: '100%', height: '1px', backgroundColor: 'black'}}></div>
            <div>
                <span className={classes.dataHeader}>Пароль:</span>
                <span className={classes.data}>**************</span>
            </div>

            <div className={classes.editBtn} onClick={() => setEditModalIsActive(true)}>
                <span>Редактировать профиль</span>
                <img src={editIcon} alt="edit-icon" />
            </div>

            <Modal modalHeader='Что хотите изменить?' isEditModal={true} btn1='Редактировать' btn2='Отмена' isActive={editModalIsActive} onClick={() => setEditModalIsActive(false)}></Modal>
        </div>
    )
}