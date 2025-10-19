import classes from './Button.module.scss'

export default function Button({ color, children, onClick, type }) {
    return (
        <button className={`${classes.btn} ${classes[color]}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
}