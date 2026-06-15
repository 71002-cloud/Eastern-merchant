export default function FilterBtn( props) {

    const style = {
        backgroundColor: props.isActive ? '#1e3a45' : '#162028',
        color: props.isActive ? '#1395b2' : '#c8dde4',
        borderColor: props.isActive ? '#1395b2' : '#1e3a45',
        boxShadow: props.isActive ? '0 0 6px rgba(19, 149, 178, 0.3)' : 'none',
    }

    return (
        <button className="filter-btn" style={style} onClick={props.onClick}>{props.label}</button>
    )
}