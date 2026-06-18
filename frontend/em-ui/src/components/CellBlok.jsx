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
                border: '1px solid #3a3a3a',
                backgroundColor: '#2a2a2a30',
                color: '#555555'
             };
        } else if (props.time_remaining <= 60) {
            return {
                border: '1px solid #1395b2',
                backgroundColor: '#1395b255',
                boxShadow: '0 0 8px #1395b270'
             }
        } else if (props.time_remaining <= 180) {
            return {
                border: '1px solid #0f7a96',
                backgroundColor: '#0f7a9645',
                boxShadow: '0 0 6px #0a4d6080'
             }
        } else if (props.time_remaining <= 1440) {
            return {
                border: '1px solid #4a7a8a',
                backgroundColor: '#4a7a8a38',
                boxShadow: '0 0 4px #1a3a4260',
             }
        }
    }

    return (
        <div className="cell-blok" style={style()}>
            <h1>{props.id.toUpperCase()}</h1>
            {props.location && <p className="location">Lokation: {props.location}</p>}
            <p>Ejer: {props.owner}</p>
            <p>Tid: {formatTimeRemaining(props.time_remaining)}</p>
        </div>
    )
}