'use client'
import { useEffect, useState } from "react"
import './grid.css'
import Grid from "./Grid";
import testData from '../test.json'

export default function Home(props) {
  const [position, setPosition] = useState([]);
  const [seq, setSeq] = useState();
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState({ n: 0, m: 0 });
  const [testing, setTesting] = useState(true);
  const [ticks, setTicks] = useState(0);

  function loadJSON() {
    if (size.n != 0) return
    if (testing) {
      parseJSON(testData)
      return <></>
    }
    return <input type="file" onChange={handleChange} />
  }

  const parseJSON = (data) => {
    setSeq(data["paths"]);
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
    if (seq && seq.length > 0 && progress !== seq[0].length) {
      let newCoords = []
      for (const path of seq) {
        const nextStep = path[progress];
        newCoords.push(nextStep)
      }
      setProgress(pr => pr + 1)
      setPosition(newCoords)
      setTicks(t => t + 1)
    }
  }

  useEffect(() => {
    if (seq) {
      const initCoords = []
      for (const path of seq) {
        const init = path[0];
        initCoords.push(init)
      }
      setPosition(initCoords)
      setProgress(1)
    }
  }, [seq])

  return (
    <main>
      {loadJSON()}
      {position.length > 0 ?
        <section className="gridHolder" onClick={consumeMove}>
          <iframe src="./Medicinegraph1.html"  title="Gantt"></iframe> 
          <Grid n={size.n} m={size.m} positions={position} />
        </section> : <p>Loading...</p>}
      <h1 style={{ position: 'absolute', color: 'white', top: '350px' }}>{progress}</h1>
    </main>
  );
}
