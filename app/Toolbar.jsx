'use client'
import React, {useEffect, useRef, useState} from 'react';
import ganttData from "@/gantts.json";

function Toolbar({counter, length, animate, setAnimate}) {
    const [selectedGantt, setSelectedGantt] = useState(0)
    const [btnStates, setStates] = useState(["", "", "", "", ""])
    const [barMode, setBarMode] = useState('barAttached')
    const gridIframe = useRef(null);
    const [contentWindow, setContentWindow] = useState(null)
    const contentWindowRef = useRef();

    const ganttNamesArray = ganttData['names'].map(x => './gantts/' + x)

    useEffect(() => {
        contentWindowRef.current = contentWindow
    }, [contentWindow])

    const select = (idx, animation) => {
        const states = ["", "", "", "", ""]
        if (animation === -1) {
            if (animate !== 0) {
                setAnimate(0)
            }
        } else {
            states[idx] = "selected"
            setAnimate(animation)
        }
        setStates(states)
    }

    let iframeItem = gridIframe.current?gridIframe.current.contentWindow:null

    useEffect(() => {
        if ( counter % 50 === 0) {
            const move = async (count) => iframeItem.moveBarTo(count, animate*50)
            move(counter).catch(err => console.log(err))
        }
    }, [counter])

    const handleGrid = () => {
        const iframeItem = gridIframe.current.contentWindow
        // iframeItem.moveBarTo(1)
        setContentWindow(iframeItem)
    }
    return (
        <div className={barMode}>
            <div className="toolbarWrapper">
                <div className="toolbar">
                    <span>Frame: {counter}/{length} </span>
                    {counter !== length ? <>
                        <button className={btnStates[0]} onClick={() => select(0, -1)}>Next Frame</button>
                        <button className={btnStates[1] + " separate"} onClick={() => select(1, 250)}>
                            <span>Play </span>
                        </button>
                        <button className={btnStates[2]} onClick={() => select(2, 50)}><span>Fast </span>
                        </button>
                        <button className={btnStates[3]} onClick={() => select(3, 8)}><span>Fastest </span>
                        </button>
                        <button onClick={() => select(0, -1)}><span>Pause</span></button>
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
    );
}

export default Toolbar;