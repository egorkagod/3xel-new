import classes from './DeleteModal.module.scss'
import classNames from 'classnames'

export default function DeleteModal({ active, deleteProduct, close, header, btn1, btn2 }) {
    return (
        <div className={classNames(classes.globalContainer, { [classes.active]: active })}>
            <div className={classes.modal}>
                <h4>{header}</h4>
                <div className={classes.btnContainer}>
                    <button onClick={deleteProduct}>{btn1}</button>
                    <button onClick={close}>{btn2}</button>
                </div>
            </div>
        </div>
    )
}