import classes from './PopUp.module.scss'
import classNames from 'classnames'
import ReactDOM from 'react-dom'

export default function PopUp({ isActive, children }) {
    return ReactDOM.createPortal(
        <div className={classNames(classes.popup, {[classes.active] : isActive})}>
            {children}
        </div>,
        document.getElementById('popup-root')
    )
}