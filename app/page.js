'use client'
import { useState } from "react"
import './grid.css'
import Grid from "./Grid";
import testData from '../test.json'

export default function Home(props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [seq, setSequence] = useState();
  const [size, setSize] = useState({ n: 0, m: 0 });
  const [testing, setTesting] = useState(true);

  function loadJSON() {
    if (size.n != 0) return
    if (testing) {
      parseJSON(testData)
      return <></>
    }
    return <input type="file" onChange={handleChange} />
  }

  const parseJSON = (data) => {
    setSequence(data["paths"][0]);
    setSize({ n: data.n, m: data.m })
  }

  function handleChange(event) {
    const file = event.target.files[0]
    if (file['type'] === 'application/json') {
      let reader = new FileReader();
      reader.onload = (event) => parseJSON(JSON.parse(event.target.result))
      reader.readAsText(file);

    }
  }

  const consumeMove = () => {
    if (seq && seq.length > 0) {
      const newCoords = seq[0]
      setSequence(seq.slice(1))
      if (Number.isInteger(newCoords)) {
        setPosition(newCoords)
      } else {
        setPosition({ x: newCoords[0], y: newCoords[1] })

      }
    }
  }

  return (
    <main>
      {loadJSON()}
      <section className="gridHolder" onClick={consumeMove}>
        <Grid n={size.n} m={size.m} position={position} />
      </section>
    </main>
  );
}
