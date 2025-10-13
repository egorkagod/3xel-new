import classes from './SectionHeader.module.scss'

export default function SectionHeader({ header, children }) {
    return (
        <div className={classes.globalSectionHeader}>
            <h2 className={classes.sectionHeader}>{header}</h2>
            <span className={classes.sectionSubtitle}>{children}</span>
        </div>
    )
}