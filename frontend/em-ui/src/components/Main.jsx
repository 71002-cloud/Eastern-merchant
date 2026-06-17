import { useEffect, useState } from 'react';

import { getCellInfo } from '../api';
import FilterBtn from './FilterBtn';
import CellBlok from './CellBlok';

export default function Main() {
    const [response, setResponse] = useState(null);
    const [sortedResponse, setSortedResponse] = useState(null);
    const [error, setError] = useState(null);
    const [underDay, setUnderDay] = useState(true);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        getCellInfo()
            .then(res => {
                setResponse(res);
                setError(null);
            })
            .catch(err => {
                setResponse([]);
                setSortedResponse([]);
                setError(err?.message || "Failed to load cell data");
            });
    }, []);

    function handleSearchChange(event) {
        setSearchValue(event.target.value);
    }

    function sort(response) {
        if (underDay === true) {
            const filteredResponse = response?.filter(cell => cell.time_remaining < 24 * 60 && cell.time_remaining != 0);
            const sortedResponse = filteredResponse?.sort((a, b) => a.time_remaining - b.time_remaining);
            setSortedResponse(sortedResponse);
        } else {
            const sortedResponse = response?.sort((a, b) => {
                if (a.time_remaining === 0 && b.time_remaining !== 0) return 1;
                if (b.time_remaining === 0 && a.time_remaining !== 0) return -1;
                return a.time_remaining - b.time_remaining;
            });
            setSortedResponse(sortedResponse);
        }
    }

    useEffect(() => {
        sort(response);
    }, [response, underDay]);

    useEffect(() => {
        const filteredResponse = response?.filter(cell => cell.id.toLowerCase().includes(searchValue.toLowerCase()));
        sort(filteredResponse);
    }, [searchValue]);

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
                    {error ? <p>{error}</p> : null}
                    {cellBloks}
                </div>
            </div>
        </main>
    )
}