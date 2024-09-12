'use client'
import {useEffect, useState, useRef} from "react"
import './grid.css'
import Grid from "./Grid";
import testData from '../test.json'
import ganttData from '../gantts.json'

export default function Home(props) {
    const [position, setPosition] = useState([]);
    const [seq, setSeq] = useState();
    const [progress, setProgress] = useState(0);
    const [size, setSize] = useState({n: 0, m: 0});
    const [testing, setTesting] = useState(true);
    const [animate, setAnimate] = useState(0)
    const [btnStates, setStates] = useState(["", "", "", "", ""])
    const gridIframe = useRef(null);
    const [contentWindow, setContentWindow] = useState(null)
    const [selectedGantt, setSelectedGantt] = useState(0)
    const [barMode, setBarMode] = useState('barAttached')
    const ganttNamesArray = ganttData['names'].map(x => './gantts/' + x)

    function loadJSON() {
        // already loaded
        if (size.n !== 0) return
        if (testing) {
            parseJSON(testData)
            return <></>
        }
        return <input type="file" onChange={handleChange}/>
    }

    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const animateRef = useRef();
    const progressRef = useRef();
    const contentWindowRef = useRef();

    const animateV = time => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            // console.log(animate)
            if (animateRef.current > 0 && deltaTime > 100) {
                consumeMove()
                previousTimeRef.current = time;

            }
        } else {
            previousTimeRef.current = time;
        }
        requestRef.current = requestAnimationFrame(animateV);
    }

    useEffect(() => {
        animateRef.animate = 0
        requestRef.current = requestAnimationFrame(animateV);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const parseJSON = (data) => {
        setSeq(data["paths"]);
        setSize({n: data.n, m: data.m})
    }

    function handleChange(event) {
        const file = event.target.files[0]
        if (file['type'] === 'application/json') {
            let reader = new FileReader();
            reader.onload = (event) => parseJSON(JSON.parse(event.target.result))
            reader.readAsText(file);

        }
    }

    useEffect(() => {
        window.abc = (vtbl) => {
            console.log(vtbl)
        };
    }, []);

    useEffect(() => {
        progressRef.current = progress
    }, [progress])

    useEffect(() => {
        contentWindowRef.current = contentWindow
    }, [contentWindow])

    const consumeMove = (x, y) => {
        if (seq && seq.length > 0 && progressRef.current !== seq[0].length) {
            let newCoords = []
            for (const path of seq) {
                const nextStep = path[progressRef.current];
                newCoords.push(nextStep)
            }
            if (gridIframe.current.contentWindow && gridIframe.current.contentWindow.moveBarTo) {
                gridIframe.current.contentWindow.moveBarTo(progressRef.current + 1, y)
            }
            setProgress(pr => pr + 1)
            setPosition(newCoords)
        }
    }

    // place initial position
    useEffect(() => {
        if (seq) {
            const initCoords = []
            for (const path of seq) {
                const init = path[0];
                initCoords.push(init)
            }
            setPosition(initCoords)
            setProgress(1)
        }
    }, [seq])

    const select = (idx, animation) => {
        const states = ["", "", "", "", ""]

        if (animation === -1) {
            if (animate !== 0) {
                setAnimate(0)
            }
            consumeMove()
        } else {
            states[idx] = "selected"
            setAnimate(animation)
        }
        setStates(states)
    }

    const handleGrid = () => {
        const iframeItem = gridIframe.current.contentWindow
        iframeItem.moveBarTo(progress)
        setContentWindow(iframeItem)
    }

    const grid_order = size.n * 2 > size.m && size.m * 2 > size.n ? 'layoutRow' : 'layoutCol'

    return (<main>
        {loadJSON()}
        {position.length > 0 ? <section className="gridHolder">
            <Grid n={size.n} m={size.m} speed={animate} positions={position}/>
            <div className={barMode}>
                <div className="toolbarWrapper">
                    <div className="toolbar">
                        <span>Frame: {progress}/{seq[0].length} </span>
                        {progress !== seq[0].length ? <>
                            <button className={btnStates[0]} onClick={() => select(0, -1)}>Next Frame</button>
                            <button className={btnStates[1] + "separate"} onClick={() => {
                                animateRef.current = 1
                            }}>
                                <span>Play </span>
                            </button>
                            <button className={btnStates[2]} onClick={() => select(2, 250)}><span>Fast </span>
                            </button>
                            <button className={btnStates[3]} onClick={() => select(3, 100)}><span>Fastest </span>
                            </button>
                            <button onClick={() => {
                                animateRef.current = 0
                            }}><span>Pause</span></button>
                            <button
                                className="separate"
                                onClick={() => setBarMode(state => state === 'barAttached' ? 'barDetached' : 'barAttached')}>
                                <span>{barMode === 'barAttached' ? 'Detach' : 'Attach'}</span>
                            </button>

                            <div className="chartButtons">
                                <button
                                    onClick={() => setSelectedGantt(idx => ((idx > 0 ? idx - 1 : ganttNamesArray.length - 1)))}>
                                    <span>Prev</span></button>
                                <button
                                    onClick={() => setSelectedGantt(idx => ((idx + 1) % ganttNamesArray.length))}>
                                    <span>Next</span></button>
                            </div>
                        </> : ""}
                    </div>
                </div>
                <iframe ref={gridIframe} onLoad={handleGrid} src={ganttNamesArray[selectedGantt]} title="Gantt"/>
            </div>
        </section> : <p>Loading...</p>}
    </main>);
}
