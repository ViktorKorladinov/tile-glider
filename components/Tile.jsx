import React, {memo, useEffect, useRef, useState} from 'react'
import {getColorFromGradient} from '@/utils/colorUtilities';

const Tile = memo(function NonMemoTile({
                                           w,
                                           h = w,
                                           x,
                                           y,
                                           idx,
                                           selected,
                                           maxPath,
                                           setMedicine,
                                           name = 'Interface',
                                           speed
                                       }) {
    let color = getColorFromGradient(idx, maxPath)
    let tileType = "tile"
    if (selected === 1) {
        color = 'lightgreen'
        tileType += 'selected'
    } else if (name === 'Interface') {
        tileType += " interface"
        color = 'lightblue'
    }
    const [stateY, setStateY] = useState(y)
    const [stateX, setStateX] = useState(x)
    const trans = `fill ${speed}ms linear`
    const textRef = useRef(null);

    useEffect(() => {
        const textElement = textRef.current;
        const textBBox = textElement.getBBox();
        const textWidth = textBBox.width;
        setStateX(x + w / 2 - textWidth / 2)
        setStateY(y + h / 2 + 40)
    }, [h, y, idx, x, w]);
    return (<g className={tileType} onMouseEnter={() => {
        setMedicine(name)
    }} onMouseLeave={() => {
        setMedicine("")
    }}>
        <rect y={y} x={x} width={w} height={h} fill={color}
              style={{transition: trans, msTransition: trans, WebkitTransition: trans}}/>
        <text ref={textRef} y={stateY} x={stateX} width={w} height={h} fontFamily="Verdana" fontSize="120"
              fill='black'>{idx}</text>
    </g>)
})

export default Tile