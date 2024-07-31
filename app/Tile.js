import React, { memo, useEffect } from 'react'
import { getColorFromGradient } from './utilities';

function Tile({ w, h = w, x = 0, y = 0, idx = 0 }) {
    const color = getColorFromGradient(idx, 6)
    return (
        <>
            <rect y={y} x={x} width={w} height={h} fill={color} />
            <text y={y+h} x={x} width={w} height={h} fontFamily="Verdana" fontSize="75" fill='gray'>{idx}</text>
        </>
    )
}

export default Tile