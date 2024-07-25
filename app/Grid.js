
'use client'
import { createElement, useState, useEffect } from "react"
import { animated, useSpring } from '@react-spring/web'
import './grid.css'

const CELL_SIZE = 240;

export default function Grid({ m, n, position }) {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const placeTiles = () => {
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
            gridLines.push(<line key={`h${i}0`} y1={i * CELL_SIZE} y2={i * CELL_SIZE} x1="0" x2={`${CELL_SIZE}`} />)
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
        if (Number.isInteger(position)) {
            api.start({
                from: { x: pos.x, y: pos.y },
                to: { x: pos.x + 50, y: pos.y + 50 },
                onResolve: () => {
                    api.start({
                        from: { x: pos.x + 50, y: pos.y + 50 },
                        to: { x: pos.x, y: pos.y },
                        delay: position * 250
                    })
                }
            })
        } else {
            console.log(pos)
            if (pos.y != (n - 1) * CELL_SIZE && pos.y != 0) {
                api.start({
                    from: { x: pos.x, y: pos.y },
                    to: [{ x: (position.x) * CELL_SIZE }, { y: (position.y) * CELL_SIZE }].reverse(),
                })
            } else {
                api.start({
                    from: { x: pos.x, y: pos.y },
                    to: [{ x: (position.x) * CELL_SIZE }, { y: (position.y) * CELL_SIZE }],
                })
            }
            setPos({ x: position.x * CELL_SIZE, y: position.y * CELL_SIZE })
        }



    }, [position])
    return (
        <svg height={`100vh`} viewBox={`-5 -5 ${n * CELL_SIZE + 10} ${m * CELL_SIZE + 10}`}
            xmlns="http://www.w3.org/2000/svg">
            {placeTiles()}
            <animated.rect x={srpingVals.x} y={srpingVals.y} width="113" height="113" className="mover" rx="15" />
        </svg >
    )

}