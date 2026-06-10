import TypeBtn from "./TypeBtn";

export default function BlokBtn(props) {
    const style = {
        backgroundColor: `${props.isToggle ? "#3e3f44" : "#1f2024"}`,
    }
    return (
        <button className="blok-btn" style={style} onClick={() => props.handleBlokToggle(props.blok)}>{props.blok.toUpperCase()}</button>
    )
}