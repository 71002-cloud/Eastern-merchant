export default function CellBlok(props) {

    function formatTimeRemaining(minutes) {
        minutes = Number(minutes);
        if (!Number.isFinite(minutes)) {
            return "Invalid time";
        }

        if (minutes <= 0) {
            return "Expired / Outdated";
        }

        const days = Math.floor(minutes / (24 * 60));
        const hours = Math.floor((minutes % (24 * 60)) / 60);
        const mins = minutes % 60;
        return `${days}d ${hours}h ${mins}m`;
    }

    const style = () => {
        if (props.time_remaining <= 0) {
            return { 
                backgroundColor: '#9e9e9e',
                color: '#bbbbbb',
                border: '1px solid #777777'
             };
        } else if (props.time_remaining <= 60) {
            return {
                border: '1px solid #ff0808'
             }
        } else if (props.time_remaining <= 180) {
            return {
                border: '1px solid #ffb300'
             }
        } else if (props.time_remaining <= 1440) {
            return {
                border: '1px solid #f7ff00'
             }
        }
        return {};
    }

    return (
        <div className="cell-blok" style={style()}>
            <h1>{props.id.toUpperCase()}</h1>
            <p>Ejer: {props.owner}</p>
            <p>Tid: {formatTimeRemaining(props.time_remaining)}</p>
        </div>
    )
}