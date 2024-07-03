'use client'
import { useState } from "react"
import './grid.css'
import Grid from "./Grid";
// import sequenceJSON from '../path.json'

export default function Home() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [seq, setSequence] = useState();
  const [size, setSize] = useState({ n: 0, m: 0 });

  function handleChange(event) {
    const file = event.target.files[0]
    if (file['type'] === 'application/json') {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        let data = JSON.parse(reader.result);
        setSequence(data["paths"][0]);
        setSize({ n: data.n, m: data.m })
      };
    }
  }

  const consumeMove = () => {
    if (seq && seq.length > 0) {
      const newCoords = seq[0]
      setSequence(seq.slice(1))
      setPosition({ x: newCoords[0], y: newCoords[1] })
    }
  }

  return (
    <main>
      <input type="file" onChange={handleChange} />
      <button onClick={consumeMove}>Move</button>
      <Grid n={size.n} m={size.m} position={position} />
    </main>
  );
}
