'use client'
import {useState, useEffect, useRef, cloneElement} from "react"
import {animated, useSprings} from '@react-spring/web'
import './grid.css'
import Tile from "./Tile"
import dispenserInfo from '../dispensers.json'
import patientColors from '../patient_color_dict.json'
import Toolbar from "@/app/Toolbar";


const CELL_SIZE = 240;
// m x n
export default function Grid_v2({m, n, positions}) {
    const [counter, setCounter] = useState(1)
    const [speed, setSpeed] = useState(0)
    const statePosC = positions.map(arr => ({x: arr[0].x * CELL_SIZE, y: arr[0].y * CELL_SIZE}));
    const moversRefs = useRef(statePosC)
    const [up, setUp] = useState([]);
    const [down, setDown] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [medicineName, setMedicine] = useState([]);

    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const animateRef = useRef(0);
    const progressRef = useRef(1);

    const animateV = time => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            if (animateRef.current > 0 && deltaTime > animateRef.current) {
                consumeMove()
                previousTimeRef.current = time;
            }
        } else {
            previousTimeRef.current = time;
        }
        if (progressRef.current !== positions[0].length)
            requestRef.current = requestAnimationFrame(animateV);
        else
            progressRef.current -= 1
    }

    useEffect(() => {
        animateRef.current = speed
    }, [speed]);

    useEffect(() => {
        window.abc = ()=>{}
        requestRef.current = requestAnimationFrame(animateV);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const consumeMove = () => {
        if (positions && positions.length > 0 && progressRef.current !== positions[0].length-1) {
            let newCoords = []
            for (const path of positions) {
                const nextStep = path[progressRef.current+1];
                newCoords.push(nextStep)
            }
            api.start(index => {
                const position = newCoords[index]
                let res = []
                const pos = moversRefs.current
                if (pos.y !== (n - 1) * CELL_SIZE && pos.y !== 0) {
                    res = {
                        from: {x: pos.x, y: pos.y},
                        to: [{x: (position.x) * CELL_SIZE}, {y: (position.y) * CELL_SIZE}].reverse(),
                    }
                } else {
                    res = {
                        from: {x: pos.x, y: pos.y}, to: [{x: (position.x) * CELL_SIZE}, {y: (position.y) * CELL_SIZE}],
                    }
                }
                moversRefs.current[index] = {x: position.x * CELL_SIZE, y: position.y * CELL_SIZE}
                return {...res, config: {duration: animateRef.current}}
            })
            progressRef.current += 1
            setCounter(ct => ct + 1)
        }
    }

    const placeTiles = () => {
        const leftC = []
        const rightC = []
        const upC = []
        const downC = []
        for (let index = 0; index < n; index++) {
            upC.push(<Tile setMedicine={setMedicine} speed={speed} key={`upperH${index}`} name={dispenserInfo[`${index}x0`]} k={`upperH${index}`}
                           w={CELL_SIZE} x={index * CELL_SIZE}/>)
            downC.push(<Tile setMedicine={setMedicine} speed={speed} key={`lowerH${index}`} name={dispenserInfo[`${index}x${m - 1}`]}
                             k={`lowerH${index}`} w={CELL_SIZE} x={index * CELL_SIZE} y={(m - 1) * CELL_SIZE}/>)
        }
        for (let index = 1; index < m - 1; index++) {
            leftC.push(<Tile setMedicine={setMedicine} speed={speed} key={`leftV${index}`} name={dispenserInfo[`0x${index}`]} k={`leftV${index}`}
                             w={CELL_SIZE} y={index * CELL_SIZE}/>)
            rightC.push(<Tile setMedicine={setMedicine} speed={speed} key={`rightV${index}`} name={dispenserInfo[`${n - 1}x${index}`]}
                              k={`rightV${index}`} w={CELL_SIZE} x={(n - 1) * CELL_SIZE} y={index * CELL_SIZE}/>)
        }
        setUp(upC)
        setDown(downC)
        setLeft(leftC)
        setRight(rightC)
    }
    useEffect(placeTiles, [])

    const [srpingVals, api] = useSprings(positions.length, idx => ({
        from: statePosC[idx],
    }))

    // heatmap
    useEffect(() => {
        let newLeft = left
        let newRight = right
        let newUp = up
        let newDown = down
        const horizontalTiles = (val, idx, x) => {
            if (idx === x) {
                return cloneElement(val, {
                    idx: val.props.idx ? val.props.idx + 1 : 1,
                });
            }
            return val
        }
        if (up.length === 0) return

        for (const pos of positions) {
            const {x, y, mode} = pos[progressRef.current]
            if (mode !== "transit") {
                continue
            }
            if (y === 0) {
                newUp = newUp.map((val, idx) => horizontalTiles(val, idx, x))
            } else if (y === m - 1) {
                newDown = newDown.map((val, idx) => horizontalTiles(val, idx, x))
            } else if (x === 0) {
                newLeft = newLeft.map((val, idx) => horizontalTiles(val, idx, y - 1))
            } else if (x === n - 1) {
                newRight = newRight.map((val, idx) => horizontalTiles(val, idx, y - 1))
            }
        }
        setUp(newUp)
        setLeft(newLeft)
        setRight(newRight)
        setDown(newDown)
    }, [counter])

    return (<>
        <svg viewBox={`-5 -5 ${n * CELL_SIZE + 10} ${m * CELL_SIZE + 10}`}
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                {srpingVals.map((spring, id) => (
                    <pattern key={`def${id}`} id={`bgPattern${id}`} patternUnits="userSpaceOnUse" width="20"
                             height="20">

                        <rect width="20" height="20"
                              fill={patientColors[positions[id][progressRef.current].patient]}/>
                        <path d='M-1,1 l2,-2
                        M0,20 l20,-20
                        M19,21 l2,-2'
                              stroke='black' strokeWidth='4'/>
                    </pattern>))}
            </defs>

            <g id="gridSvg">
                {left}{right}{up}{down}
            </g>
            {srpingVals.map((spring, id) => {
                return (<animated.rect key={`mover${id}`} x={spring.x} y={spring.y} width="112" height="112" style={{
                    fill: `url(#bgPattern${id})`
                }} rx="15"/>)
            })}
        </svg>
        <Toolbar counter={counter} length={positions[0].length} animate={speed} medicineName={medicineName} consumeMove={consumeMove} setAnimate={setSpeed}/>
    </>)

}