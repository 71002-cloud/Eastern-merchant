export default function CellBlok(props) {

    function formatTimeRemaining(minutes) {
        minutes = Number(minutes);
        if (!Number.isFinite(minutes)) {
            return "Invalid time";
        }

        if (minutes <= 0) {
            return "Expired";
        }

        const days = Math.floor(minutes / (24 * 60));
        const hours = Math.floor((minutes % (24 * 60)) / 60);
        const mins = minutes % 60;
        return `${days}d ${hours}h ${mins}m`;
    }

    return (
        <div className="cell-blok">
            <h1>{props.id}</h1>
            <p>Ejer: {props.owner}</p>
            <p>Tid: {formatTimeRemaining(props.time_remaining)}</p>
        </div>
    )
}