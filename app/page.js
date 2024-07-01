'use client'
import { createElement, useState, useEffect } from "react"
import { animated, useSpring } from '@react-spring/web'
import './grid.css'
// import sequenceJSON from '../path.json'

function Grid({ m, n, position }) {

  const [pos, setPos] = useState({ x: 25, y: 25 });

  const placeTiles = () => {
    const tilesArray = []
    for (let i = 0; i < n; i++) {
      tilesArray.push(placeATileAt(0, i))
      tilesArray.push(placeATileAt(m - 1, i))
    }
    for (let j = 1; j < m - 1; j++) {
      tilesArray.push(placeATileAt(j, 0))
      tilesArray.push(placeATileAt(j, n - 1))
    }

    return tilesArray
  }

  const placeATileAt = (posX, posY) => {
    return createElement(
      'rect',
      { key: `${posX}|${posY}`, x: posX * 50, y: posY * 50, width: "50", height: "50", className: "border" },
    );
  }

  const [srpingVals, api] = useSpring(() => ({
    from: { x: 0, y: 0 },
  }))

  useEffect(() => {
    api.start({
      from: { x: pos.x, y: pos.y },
      to: [{ x: (position.x) * 50+25 }, { y: (position.y) * 50+25 }],
      onResolve: () => setPos({ x: position.x * 50+25
        , y: position.y * 50+25 }),
    })
  }, [position])

  return (
    <svg width={`800px`} height={`800px`} viewBox={`0 0 ${m * 50} ${n * 50}`}
      xmlns="http://www.w3.org/2000/svg">

      {placeTiles()}
      <animated.circle cx={srpingVals.x} cy={srpingVals.y} r='15' className="mover" />
    </svg >
  )

}


export default function Home() {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [seq, setSeq] = useState([
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5],
    [0, 1], [0, 2], [0, 3], [0, 4],
    [10, 1], [10, 2], [10, 3], [10, 4]
  ]);

  const consumeMove = () => {
    const newCoords = seq[seq.length - 1]
    setSeq(seq.slice(0, -2))
    setPosition({ x: newCoords[0]+1, y: newCoords[1]+1 })
  }

  return (
    <main>
      <button onClick={consumeMove}>Move</button>
      <Grid n={11} m={6} position={position} />
    </main>
  );
}
