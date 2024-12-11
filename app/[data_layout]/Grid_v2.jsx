// noinspection JSValidateTypes,JSIncompatibleTypesComparison

'use client'
import {useState, useEffect, useRef, useCallback} from "react"
import {animated, useSprings} from '@react-spring/web'
import './grid.css'
import Tile from "./Tile"
import Toolbar from "./Toolbar";


const CELL_SIZE = 240;
// m x n
export default function Grid_v2({m, n, simulationData}) {
    const medicineInfo = simulationData[2]
    const dispenserInfo = simulationData[0]
    const positions = simulationData[5]['paths']
    const patientColors = simulationData[3]
    const ganttData = simulationData[1]
    const [counter, setCounter] = useState(1)
    const [speed, setSpeed] = useState(0)
    const [matrix, setMatrix] = useState(() => {
        return Array.from({length: m}, () => Array(n).fill(0));
    });
    const [selected, setSelected] = useState(() => {
        return Array.from({length: m}, () => Array(n).fill(0));
    });
    const [medicineName, setMedicine] = useState("");

    const statePosC = positions.map(arr => ({x: arr[0].x * CELL_SIZE, y: arr[0].y * CELL_SIZE}));
    const [srpingVals, api] = useSprings(positions.length, idx => ({
        from: statePosC[idx],
    }))

    const moversRefs = useRef(statePosC);
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const animateRef = useRef(0);
    const progressRef = useRef(1);
    const medicineRef = useRef('');

    // react to animation speed change
    useEffect(() => {
        animateRef.current = speed
    }, [speed]);

    // react to medicine selection
    useEffect(() => {
        if (medicineName === medicineRef.current) return
        let updatedSelected = Array.from({length: m}, () => Array(n).fill(0))
        if (medicineName.length > 0) {
           for (const singleMedicineName of medicineName.split(',')) {
               for (let coordinate of medicineInfo[singleMedicineName]) {
                   const x = coordinate[0]
                   const y = coordinate[1]
                   updatedSelected[x][y] = 1;
               }
           }
            medicineRef.current = medicineName
        } else {
            medicineRef.current = ''
        }
        setSelected(updatedSelected);
    }, [medicineInfo, matrix, m, medicineName, n, selected])

    const consumeMove = useCallback(() => {
        if (positions && positions.length > 0 && progressRef.current !== positions[0].length - 1) {
            let newCoords = []
            for (const path of positions) {
                const nextStep = path[progressRef.current + 1];
                newCoords.push(nextStep)
            }
            api.start(index => {
                const position = newCoords[index]
                let res;
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
            const updatedMatrix = [...matrix]; // Update heatmap
            for (const pos of newCoords) {
                const {x, y, mode} = pos
                if (mode !== "transit") {
                    continue
                }
                updatedMatrix[x][y] += 1;
            }
            setMatrix(updatedMatrix);
        }
    }, [api, matrix, n, positions])

    const animateV = useCallback(time => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            if (animateRef.current > 0 && deltaTime > animateRef.current) {
                consumeMove()
                previousTimeRef.current = time;
            }
        } else {
            previousTimeRef.current = time;
        }
        if (progressRef.current !== positions[0].length) requestRef.current = requestAnimationFrame(animateV); else progressRef.current -= 1
    }, [consumeMove, positions])

    useEffect(() => {
        window.abc = (val) => {
            const name = val['points'][0]['data']['offsetgroup']
            if (name in medicineInfo) {
                setMedicine(name)
            }
        }
        window.reset = () => {
            setMedicine("")
        }
        window.legend = (data) => {
            setMedicine(medicine => {
                const newMed = data['data'][data['curveNumber']]['legendgroup']
                if (medicine === newMed) {
                    return ""
                } else {
                    return newMed
                }
            });
        }
        requestRef.current = requestAnimationFrame(animateV);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animateV, medicineInfo]);


    const placeTiles = () => {
        let res = []
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (i === 0 || j === 0 || i === m - 1 || j === n - 1) {
                    res.push(<Tile maxPath={ganttData['max_path']} setMedicine={setMedicine} selected={selected[i][j]} speed={speed} key={`${i}x${j}`}
                                   name={dispenserInfo[`${i}x${j}`]}
                                   w={CELL_SIZE} x={i * CELL_SIZE} y={j * CELL_SIZE} idx={matrix[i][j]}/>)
                }
            }
        }
        return res
    }

    return (<>
        <svg viewBox={`-5 -5 ${n * CELL_SIZE + 10} ${m * CELL_SIZE + 10}`}
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                {srpingVals.map((spring, id) => (
                    <pattern key={`def${id}`} id={`bgPattern${id}`} patternUnits="userSpaceOnUse" width="20"
                             height="20">

                        <rect width="20" height="20"
                              fill={patientColors[positions[id][progressRef.current]['patient']]}/>
                        <path d='M-1,1 l2,-2
                        M0,20 l20,-20
                        M19,21 l2,-2'
                              stroke='black' strokeWidth='4'/>
                    </pattern>))}
            </defs>

            <g id="gridSvg">
                {placeTiles()}
            </g>
            {srpingVals.map((spring, id) => {
                return (
                    <animated.rect key={`mover${id}`} x={spring['x']} y={spring['y']} width="12" height="112" style={{
                        fill: `url(#bgPattern${id})`
                    }} rx="15"/>)
            })}
        </svg>
        <Toolbar counter={counter} length={positions[0].length} animate={speed} medicineName={medicineName}
                 consumeMove={consumeMove} setAnimate={setSpeed} setMedicine={setMedicine} ganttData={ganttData} />
    </>)

}