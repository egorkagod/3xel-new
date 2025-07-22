import classes from './Profile.module.scss'
import { Link, Outlet } from 'react-router'
import exitIcon from '/images/exit-icon.png'
import Modal from './ProfileInfo/Modal/Modal'
import { useState, useEffect } from 'react'
import { getCookie } from '../../utils/cookie'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { clearProfile, setAuthorized, updateProfile } from '../store/profileSlice'

export default function Profile() {

    const [exitModalIsActive, setExitModalIsActive] = useState(false)
    const csrfToken = getCookie('csrftoken')
    const navigate = useNavigate()
    const dispatcher = useDispatch()

    useEffect(() => {

        fetch('/api-root/user/', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка: ${response.status}, ${response.statusText}`)
                return response.json()
            })
            .then(data => { dispatcher(updateProfile(data)); dispatcher(setAuthorized(true)) })
            .catch(_ => { dispatcher(setAuthorized(false)); navigate('/'); toast.error('Ошибка загрузки профиля, войдите заново') })
    }, [])

    const unLogin = async () => {
        try {
            const response = await fetch('/api-root/logout/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include'
            })

            if (!response.ok) throw new Error('Ошибка при выходе!')

            dispatcher(setAuthorized(false))
            dispatcher(clearProfile())
            navigate('/')
            toast.success('Вы вышли из профиля')
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <div className={classes.globalContainer}>
            <div className={classes.profileContainer}>
                <aside>
                    <nav>
                        <ul>
                            <li>
                                <Link style={{ all: 'unset' }} to='/profile/info'><button>Мои данные</button></Link>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Link style={{ all: 'unset' }} to='/profile/my-orders'><button>Мои заказы</button></Link>
                                <div style={{ display: 'flex', borderRadius: '50%', backgroundColor: 'black', color: 'white', width: '20px', height: '20px', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>0</div>
                            </li>
                        </ul>
                    </nav>

                    <h2>Профиль.</h2>
                </aside>

                <main style={{ display: 'flex', padding: '50px 300px 50px 100px', width: '100%', position: 'relative', height: '100%' }}>
                    <Outlet />
                    <div className={classes.exitBtn} onClick={() => setExitModalIsActive(true)}>
                        <span>Выход</span>
                        <img src={exitIcon} alt="exit-icon" />
                    </div>
                </main>
            </div>

            <Modal modalHeader='Хотите выйти?' btn1='Выйти' btn2='Отмена' isActive={exitModalIsActive} onClick={() => setExitModalIsActive(false)} onAction={unLogin}></Modal>
        </div>
    )
}