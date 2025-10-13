import classes from './Button.module.scss'

export default function Button({ color, children }) {
    return (
        <button className={`${classes.btn} ${classes[color]}`}>
            {children}
        </button>
    )
}