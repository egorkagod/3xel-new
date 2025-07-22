import classes from './ProfileInfo.module.scss'
import editIcon from '/images/edit-icon.png'
import Modal from './Modal/Modal'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function ProfileInfo() {

    const [editModalIsActive, setEditModalIsActive] = useState(false)
    const profile = useSelector(state.profile.profileData)
    

    return (
        <div className={classes.globalContainer}>
            <div>
                <span className={classes.dataHeader}>Имя:</span>
                <span className={classes.data}>{profile.first_name}</span>
            </div>
            <div>
                <span className={classes.dataHeader}>Почта:</span>
                <span className={classes.data}>{profile.email}</span>
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