import classes from './Point.module.scss'

export default function Point({ number, header, children, img, alt }) {
    return (
        <div className={classes.point}>
            <div className={classes.leftSide}>
                <div className={classes.number}>{number}</div>
                <div className={classes.content}>
                    <h4 className={classes.pointHeader}>{header}</h4>
                    <span className={classes.text}>{children}</span>
                </div>
            </div>
            <img className={classes.image} src={img} alt={alt} loading='lazy' />
        </div>
    )
}