import classes from './Loader.module.scss'

export default function Loader({ color }) {
    return (
        <div className={classes.circle} style={{ borderTop: `4px solid ${color}` }}>

        </div>
    )
}