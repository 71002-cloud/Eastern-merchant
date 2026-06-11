export default function FilterBtn( props) {

    const style = {
        backgroundColor: props.isActive ? '#84bcf7' : '#CCCCCC',
    }

    return (
        <button className="filter-btn" style={style} onClick={props.onClick}>{props.label}</button>
    )
}