import React from 'react'
import { getColorFromGradient } from './utilities';

function Tile({ w, h = w, x = 0, y = 0, idx = 0,name }) {
    const color = getColorFromGradient(idx, 6)
    return (
        <>
            <rect y={y} x={x} width={w} height={h} fill={color} />
            <text y={y+h} x={x} width={w} height={h} fontFamily="Verdana" fontSize="40" fill='white'>{idx} | {name}</text>
        </>
    )
}

export default Tile