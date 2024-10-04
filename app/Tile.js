import React, {useEffect, useRef, useState} from 'react'
import {getColorFromGradient} from './utilities';

function Tile({w, h = w, x = 0, y = 0, idx = 0, name, speed = 500}) {
    const color = getColorFromGradient(idx)
    const [stateY, setStateY] = useState(y)
    const trans = `fill ${speed}ms linear`
    const textRef = useRef(null);

    useEffect(() => {
        const textElement = textRef.current;
        const textBBox = textElement.getBBox();
        const textWidth = textBBox.width;
        setStateY(y + h / 2 + 40)
    }, [h, y, idx]);

    return (
        <>
            <rect y={y} x={x} width={w} height={h} fill={color}
                  style={{transition: trans, msTransition: trans, WebkitTransition: trans}}/>
            <text ref={textRef} y={stateY} x={x+w/2} width={w} height={h} fontFamily="Verdana" fontSize="120"
                  fill='black'>{idx}</text>
        </>
    )
}

export default Tile