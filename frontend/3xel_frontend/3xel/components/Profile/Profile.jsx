import classes from './Profile.module.scss'
import ReactDOM from 'react-dom'
import SignIn from './SignIn/SignIn'
import classNames from 'classnames'

export default function Profile({ isActive, onClick }) {
    return ReactDOM.createPortal(
        <div className={classNames(classes.overlay, {[classes.active] : isActive})}>
            <div className={classes.profileModal}>
                <SignIn onClick={onClick}></SignIn>
            </div>
        </div>,
        document.getElementById('modal-root')
    )
}