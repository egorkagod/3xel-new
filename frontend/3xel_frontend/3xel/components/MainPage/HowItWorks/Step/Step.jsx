import classes from './Step.module.scss'

export default function Step({ header, children }) {
    return (
        <div className={classes.step}>
            <h4>{header}</h4>
            <p>{children}</p>
        </div>
    )
}