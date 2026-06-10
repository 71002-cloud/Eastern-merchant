import { useEffect, useState } from 'react';
import BlokBtn from './components/BlokBtn';
import TypeBtn from './components/TypeBtn';
import CellBlok from './components/CellBlok';

import { getCellInfo } from './api';

export default function App() {
  const [response, setResponse] = useState("");
  const [toggleBlok, setToggleBlok] = useState(null);
  const [toggleType, setToggleType] = useState(null);

  function handleBlokToggle(blok) {
    if (toggleBlok === blok) {
      return
    }
    setToggleBlok(blok);
    setToggleType(null);
  }

  function handleTypeToggle(type) {
    if (toggleType === type) {
      return
    }
    setToggleType(type);
  }

  useEffect(() => {
    if (toggleBlok && toggleType) {
      getCellInfo(toggleBlok, toggleType).then(data => {
        setResponse(data);
      });
    }
  }, [toggleType]);

  console.log(response)

  return (
    <div className="App">
      <section>
        <div className="blok-container">
          <BlokBtn isToggle={toggleBlok === "a"} blok="a" handleBlokToggle={handleBlokToggle} />
          <BlokBtn isToggle={toggleBlok === "b"} blok="b" handleBlokToggle={handleBlokToggle} />
          <BlokBtn isToggle={toggleBlok === "c"} blok="c" handleBlokToggle={handleBlokToggle} />
        </div>

        {toggleBlok && <div className="type-container">
          <TypeBtn isToggle={toggleType === "n"} type="n" handleTypeToggle={handleTypeToggle} blok={toggleBlok} />
          <TypeBtn isToggle={toggleType === "pre"} type="pre" handleTypeToggle={handleTypeToggle} blok={toggleBlok} />
          <TypeBtn isToggle={toggleType === "t"} type="t" handleTypeToggle={handleTypeToggle} blok={toggleBlok} />
          {toggleBlok !== "c" && <TypeBtn isToggle={toggleType === "fc"} type="fc" handleTypeToggle={handleTypeToggle} blok={toggleBlok} />}
        </div>}

        {toggleType && <div className="data-display">
          {response && response.map((cell) => (
            <CellBlok key={cell.id} id={cell.id} owner={cell.owner} time_remaining={cell.time_remaining} />
          ))}
        </div>}
      </section>
    </div>
  )
}