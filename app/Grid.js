
'use client'
import { createElement, useState, useEffect } from "react"
import { animated, useSpring } from '@react-spring/web'
import './grid.css'

const CELL_SIZE = 240;

export default function Grid({ m, n, position }) {
    const [pos, setPos] = useState({ x: 5, y: 5 });

    const placeTiles2 = () => {
        let pathData = `
        M0,0
        H${n * CELL_SIZE} V${m * CELL_SIZE} H0 Z
        M${CELL_SIZE},${CELL_SIZE}
        H${(n - 1) * CELL_SIZE} V${(m - 1) * CELL_SIZE} H${CELL_SIZE} Z
      `;
        const gridLines = []
        // Draw vertical lines for the outer and inner rectangles
        for (let i = 1; i < n; i++) {
            gridLines.push(<line key={`vert${i}0`} x1={i * CELL_SIZE} x2={i * CELL_SIZE} y1="0" y2={`${CELL_SIZE}`} />)
            gridLines.push(<line key={`vert${i}${i}`} x1={i * CELL_SIZE} x2={i * CELL_SIZE} y1={(m - 1) * CELL_SIZE} y2={m * CELL_SIZE} />)
        }
        for (let i = 1; i < n; i++) {
            gridLines.push(<line key={`h${i}0`}  y1={i * CELL_SIZE} y2={i * CELL_SIZE} x1="0" x2={`${CELL_SIZE}`} />)
            gridLines.push(<line key={`h${i}${i}`} y1={i * CELL_SIZE} y2={i * CELL_SIZE} x1={(n - 1) * CELL_SIZE} x2={n * CELL_SIZE} />)
        }

        return (
            <g id="gridSvg">
                <path d={pathData} className="border" />
                {gridLines}
            </g>
        )
    }

    const [srpingVals, api] = useSpring(() => ({
        from: pos,
    }))

    useEffect(() => {
        console.log(pos,(n - 1)*CELL_SIZE);
        if (pos.y != (n - 1)*CELL_SIZE && pos.y != 0) {
            console.log('here');
            api.start({
                from: { x: pos.x, y: pos.y },
                to: [{ x: (position.x) * CELL_SIZE}, { y: (position.y) * CELL_SIZE}].reverse(),
                onStart: () => setPos({ x: position.x * CELL_SIZE, y: position.y * CELL_SIZE }),
            })
        } else {
            api.start({
                from: { x: pos.x, y: pos.y },
                to: [{ x: (position.x) * CELL_SIZE }, { y: (position.y) * CELL_SIZE }],
                onStart: () => setPos({ x: position.x * CELL_SIZE, y: position.y * CELL_SIZE }),
            })
        }

    }, [position])
    return (
        <svg height={`95vh`} viewBox={`-5 -5 ${n * CELL_SIZE + 6} ${m * CELL_SIZE + 6}`}
            xmlns="http://www.w3.org/2000/svg">
            {/* {placeTiles()} */}
            {placeTiles2()}
            <animated.rect x={srpingVals.x} y={srpingVals.y} width="113" height="113" className="mover" rx="15" />
        </svg >
    )

}