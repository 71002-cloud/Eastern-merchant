import { useEffect, useState } from 'react';

import { getCellInfo } from '../api';
import FilterBtn from './FilterBtn';
import CellBlok from './CellBlok';

export default function Main() {
    const [response, setResponse] = useState(null);
    const [underDay, setUnderDay] = useState(true);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        getCellInfo(underDay).then(res => setResponse(res));
    }, [underDay]);

    function handleSearchChange(event) {
        setSearchValue(event.target.value);
    }

    const sortedResponse = response?.sort((a, b) => a.time_remaining - b.time_remaining);

    const cellBloks = sortedResponse?.map(cell => (
        <CellBlok
            key={cell.id}
            id={cell.id}
            owner={cell.owner}
            time_remaining={cell.time_remaining}
        />
    ));

    return (
        <main>
            <div className="display-section">
                <div className="controls">
                    <input type="text" placeholder="Search..." className="search-bar" value={searchValue} onChange={handleSearchChange} />
                    <FilterBtn label="Under a day" isActive={underDay} onClick={() => setUnderDay(true)} />
                    <FilterBtn label="All" isActive={!underDay} onClick={() => setUnderDay(false)} />
                </div>
                <div className="cell-display">
                    {cellBloks}
                </div>
            </div>
        </main>
    )
}