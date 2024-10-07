import React, {useEffect, useRef, useState} from 'react'
import {getColorFromGradient} from './utilities';

function Tile({w, h = w, x = 0, y = 0, idx = 0, name, speed = 500}) {
    const color = getColorFromGradient(idx)
    const [stateY, setStateY] = useState(y)
    const [stateX, setStateX] = useState(x)
    const trans = `fill ${speed}ms linear`
    const textRef = useRef(null);

    useEffect(() => {
        const textElement = textRef.current;
        const textBBox = textElement.getBBox();
        const textWidth = textBBox.width;
        console.log(textWidth);
        setStateX(x+w/2-textWidth/2)
        setStateY(y + h / 2 + 40)
    }, [h, y, idx]);

    return (
        <g  className={"tile"} >
            <rect y={y} x={x} width={w} height={h} fill={color}
                  style={{transition: trans, msTransition: trans, WebkitTransition: trans}}/>
            <text ref={textRef} y={stateY} x={stateX} width={w} height={h} fontFamily="Verdana" fontSize="120"
                  fill='black'>{idx}</text>
        </g>
    )
}

export default Tile