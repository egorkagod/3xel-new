import classes from './Reminder.module.scss'
import { Link } from 'react-router-dom'

export default function Reminder() {
    return (
        <section className={classes.reminderSection}> 
            <p>
                Перед созданием заказа обязательно ознакомьтесь с <Link style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline' }} to='/instruction'>инструкцией</Link> по тому, как правильно снимать видео. 
                Это поможет нам сделать максимально точный и качественный результат.
            </p>
        </section>
    )
}