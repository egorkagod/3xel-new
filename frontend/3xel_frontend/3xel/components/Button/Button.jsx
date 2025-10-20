import classNames from 'classnames'

import classes from './Button.module.scss'

export default function Button({ color = 'white', children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <button
            className={classNames(classes.btn, classes[color], className)}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
