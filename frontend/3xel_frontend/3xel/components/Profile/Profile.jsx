import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import classes from './Profile.module.scss'
import SignIn from './SignIn/SignIn'
import SignUp from './SignUp/SignUp'
import ResetPassword from './ResetPassword/ResetPassword'
import ProfileBlock from './ProfileBlock/ProfileBlock'

const MODES = {
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  RESET: 'reset',
  DASHBOARD: 'dashboard',
}

export default function Profile({ isActive, onClose }) {
  const user = useSelector((state) => state.user.data)
  const [mode, setMode] = useState(
    user ? MODES.DASHBOARD : MODES.SIGN_IN,
  )

  useEffect(() => {
    if (user) {
      setMode(MODES.DASHBOARD)
    } else if (mode === MODES.DASHBOARD) {
      setMode(MODES.SIGN_IN)
    }
  }, [user])

  useEffect(() => {
    if (!isActive && !user) {
      setMode(MODES.SIGN_IN)
    }
  }, [isActive, user])

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  let content = null
  switch (mode) {
    case MODES.SIGN_UP:
      content = (
        <SignUp
          onClose={handleClose}
          onSwitchToSignIn={() => setMode(MODES.SIGN_IN)}
        />
      )
      break
    case MODES.RESET:
      content = (
        <ResetPassword
          onClose={handleClose}
          onSwitchToSignIn={() => setMode(MODES.SIGN_IN)}
        />
      )
      break
    case MODES.DASHBOARD:
      content = (
        <ProfileBlock
          onClose={handleClose}
          onSwitchToReset={() => setMode(MODES.RESET)}
        />
      )
      break
    case MODES.SIGN_IN:
    default:
      content = (
        <SignIn
          onClose={handleClose}
          onSwitchToSignUp={() => setMode(MODES.SIGN_UP)}
          onSwitchToReset={() => setMode(MODES.RESET)}
        />
      )
      break
  }

  return ReactDOM.createPortal(
    <div
      className={classNames(classes.overlay, {
        [classes.active]: isActive,
      })}
      onClick={handleOverlayClick}
    >
      <div
        className={classes.profileModal}
        onClick={(event) => event.stopPropagation()}
      >
        {content}
      </div>
    </div>,
    document.getElementById('modal-root'),
  )
}
