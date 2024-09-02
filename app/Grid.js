'use client'
import { useState, useEffect } from "react"
import { animated, useSprings } from '@react-spring/web'
import './grid.css'
import Tile from "./Tile"
import dispenserInfo from '../dispensers.json'
import patientColors from '../patient_color_dict.json'


const CELL_SIZE = 240;
// m x n
export default function Grid({ m, n, positions }) {
    const [statePos, setStatePos] = useState(Array(positions.length).fill().map(_ => ({ x: 0, y: 0 })));
    const [up, setUp] = useState([]);
    const [down, setDown] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const placeTiles = () => {
        const leftC = []
        const rightC = []
        const upC = []
        const downC = []
        for (let index = 0; index < n; index++) {
            upC.push(<Tile key={`upperH${index}`} name={dispenserInfo[`${index}x0`]} k={`upperH${index}`} w={CELL_SIZE} x={index * CELL_SIZE} />)
            downC.push(<Tile key={`lowerH${index}`} name={dispenserInfo[`${index}x${m - 1}`]} k={`lowerH${index}`} w={CELL_SIZE} x={index * CELL_SIZE} y={(m - 1) * CELL_SIZE} />)
        }
        for (let index = 1; index < m - 1; index++) {
            leftC.push(<Tile key={`leftV${index}`} name={dispenserInfo[`0x${index}`]} k={`leftV${index}`} w={CELL_SIZE} y={index * CELL_SIZE} />)
            rightC.push(<Tile key={`rightV${index}`} name={dispenserInfo[`${n - 1}x${index}`]} k={`rightV${index}`} w={CELL_SIZE} x={(n - 1) * CELL_SIZE} y={index * CELL_SIZE} />)
        }
        setUp(upC)
        setDown(downC)
        setLeft(leftC)
        setRight(rightC)
    }
    useEffect(placeTiles, [])

    const [srpingVals, api] = useSprings(positions.length, idx => ({
        from: statePos[idx],
    }))

    // heatmap
    useEffect(() => {
        let newLeft = left
        let newRight = right
        let newUp = up
        let newDown = down
        if (up.length === 0) return

        for (const pos of positions) {
            const { x, y, mode } = pos
            if (mode !== "t") {
                continue
            }
            if (y == 0) {
                if (up.length == 0) returnid
                newUp = newUp.map((val, idx) => {
                    if (idx == x) {
                        const temp = val.props.idx ? val.props.idx : 0
                        return <Tile key={val.props.k} k={val.props.k} name={val.props.name} w={val.props.w} x={val.props.x} y={val.props.y} idx={temp + 1} />
                    }
                    return val
                })
            }
            else if (y == m - 1) {
                if (down.length == 0) return
                newDown = newDown.map((val, idx) => {
                    if (idx == x) {
                        const temp = val.props.idx ? val.props.idx : 0
                        return <Tile key={val.props.k} k={val.props.k} name={val.props.name} w={val.props.w} x={val.props.x} y={val.props.y} idx={temp + 1} />
                    }
                    return val
                })
            }
            else if (x == 0) {
                if (left.length == 0) return
                newLeft = newLeft.map((val, idx) => {
                    if (idx + 1 == y) {
                        const temp = val.props.idx ? val.props.idx : 0
                        return <Tile key={val.props.k} k={val.props.k} name={val.props.name} w={val.props.w} x={val.props.x} y={val.props.y} idx={temp + 1} />
                    }
                    return val
                })
            }
            else if (x == n - 1) {
                if (right.length == 0) return
                newRight = newRight.map((val, idx) => {
                    if (idx + 1 == y) {
                        const temp = val.props.idx ? val.props.idx : 0
                        return <Tile key={val.props.k} k={val.props.k} name={val.props.name} w={val.props.w} x={val.props.x} y={val.props.y} idx={temp + 1} />
                    }
                    return val
                })
            }
        }
        setUp(newUp)
        setLeft(newLeft)
        setRight(newRight)
        setDown(newDown)
    }, [positions])

    // Animate all movers(old pos-> new pos acquired from prop postions)
    useEffect(() => {
        const newStatePos = []

        api.start(index => {
            const pos = statePos[index]
            const position = positions[index]
            let res = []
            if (pos.y != (n - 1) * CELL_SIZE && pos.y != 0) {
                res = {
                    from: { x: pos.x, y: pos.y },
                    to: [{ x: (position.x) * CELL_SIZE }, { y: (position.y) * CELL_SIZE }].reverse(),
                }
            } else {
                res = {
                    from: { x: pos.x, y: pos.y },
                    to: [{ x: (position.x) * CELL_SIZE }, { y: (position.y) * CELL_SIZE }],
                }
            }
            newStatePos.push({ x: position.x * CELL_SIZE, y: position.y * CELL_SIZE })
            return res

        })
        setStatePos(newStatePos)
    }, [positions])

    return (
        <svg viewBox={`-5 -5 ${n * CELL_SIZE + 10} ${m * CELL_SIZE + 10}`}
            xmlns="http://www.w3.org/2000/svg">
            <g id="gridSvg">
                {left}{right}{up}{down}
            </g>
            {srpingVals.map((spring, id) => (
                
                <animated.rect key={`mover${id}`} x={spring.x} y={spring.y} width="113" height="113" style={{ fill: patientColors[positions[id].patient] }} rx="15" />))
            }
        </svg >
    )

}