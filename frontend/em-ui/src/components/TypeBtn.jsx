export default function TypeBtn(props) {
    const style = {
        backgroundColor: `${props.isToggle ? "#727479" : "#5a5b5e"}`,
    }
    return (
        <button className="type-btn" style={style} onClick={() => props.handleTypeToggle(props.type)}>{props.type.toUpperCase()}</button>
    )
}