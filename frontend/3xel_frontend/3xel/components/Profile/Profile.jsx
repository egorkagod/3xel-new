import classes from './Profile.module.scss'
import ReactDOM from 'react-dom'
import SignIn from './SignIn/SignIn'
import classNames from 'classnames'
import { useState, useEffect } from 'react'

export default function Profile({ isActive, onClick }) {

    const [showSignUp, setShowSignUp] = useState(false)

    return ReactDOM.createPortal(
        <div className={classNames(classes.overlay, { [classes.active]: isActive })}>
            <div className={classes.profileModal}>
                {showSignUp ? (
                    null
                ) : (
                    <SignIn onClick={onClick} toSignUp={() => setShowSignUp(true)}></SignIn>
                )}

            </div>
        </div>,
        document.getElementById('modal-root')
    )
}