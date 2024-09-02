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
  const [animate, setAnimate] = useState(0)
  const [btnStates, setStates] = useState(["", "", "", "", ""])

  function loadJSON() {
    if (size.n != 0) return
    if (testing) {
      parseJSON(testData)
      return <></>
    }
    return <input type="file" onChange={handleChange} />
  }

  // Animate
  useEffect(() => {
    let interval = false
    if (animate > 0) {
      interval = setInterval(() => {
        consumeMove()
      }, animate);
    }
    return () => {
      if (interval)
        clearInterval(interval);
    }
  }, [progress, animate]);


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
    }
  }

  // place initial position
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

  const select = (idx, animation) => {
    const states = ["", "", "", "", ""]

    if (animation === -1) {
      if (animate !== 0) {
        setAnimate(0)
      }
      consumeMove()
    } else {
      states[idx] = "selected"
      setAnimate(animation)
    }
    setStates(states)
  }

  return (
    <main>
      {loadJSON()}
      {position.length > 0 ?
        <section className="gridHolder" >
          <Grid n={size.n} m={size.m} positions={position} />
          <iframe src="./Medicinegraph1.html" title="Gantt" />
          <div className="toolbar">
            <span>Frame: {progress}/{seq[0].length} </span>
            {progress !== seq[0].length ? <>
              <button className={btnStates[0]} onClick={() => select(0, -1)} >Next Frame</button>
              <button className={btnStates[1]} onClick={() => select(1, 1000)}><span>Play </span> </button>
              <button className={btnStates[2]} onClick={() => select(2, 500)}><span>Fast </span></button>
              <button className={btnStates[3]} onClick={() => select(3, 250)}><span>Fastest </span></button>
              <button onClick={() => select(4, 0)}><span>Pause</span></button>
            </> : ""}
          </div>
        </section> : <p>Loading...</p>}
    </main>
  );
}
