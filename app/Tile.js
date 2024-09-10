import React from 'react'
import { getColorFromGradient } from './utilities';

function Tile({ w, h = w, x = 0, y = 0, idx = 0, name, speed=500 }) {
    const color = getColorFromGradient(idx)
    const trans = `fill ${speed}ms linear`
    return (
        <>
            <rect y={y} x={x} width={w} height={h} fill={color} style={{transition: trans, msTransition:trans, WebkitTransition: trans}} />
            <text y={y+h} x={x} width={w} height={h} fontFamily="Verdana" fontSize="40" fill='white'>{idx} | {name}</text>
        </>
    )
}

export default Tile