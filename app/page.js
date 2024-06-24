import { createElement } from "react"
import './grid.css'

export default function Home() {
  const n = 15
  const m = 20

  const createGrid = () => {
    const tilesArray = []
    for (let i = 0; i < n; i++) {
      tilesArray.push(block(0, i))
      tilesArray.push(block(m - 1, i))
    }
    for (let j = 1; j < m - 1; j++) {
      tilesArray.push(block(j, 0))
      tilesArray.push(block(j, n - 1))
    }
    return tilesArray
  }

  const placeMover = () => {
    return createElement(
      'circle',
      { key: `mover`, cx: 25, cy: 25, r:'15', className: "player" },
    );
  }

  const block = (posX, posY) => {
    return createElement(
      'rect',
      { key: `${posX}|${posY}`, x: posX * 50, y: posY * 50, width: "50", height: "50", className: "border" },
    );
  }

  return (
    <main>
      <svg width={`${m * 50}`} height={`${n * 50}`} viewBox={`0 0 ${m * 50} ${n * 50}`} xmlns="http://www.w3.org/2000/svg">
        {createGrid()}
        {placeMover()}
      </svg>


    </main>
  );


}
