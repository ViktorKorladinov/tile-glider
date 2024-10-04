'use client'
import {useEffect, useState} from "react"
import './grid.css'
import testData from '../test.json'
import Grid_v2 from "./Grid_v2";

export default function Home() {
    const [seq, setSeq] = useState();
    const [size, setSize] = useState({n: 0, m: 0});
    const [testing, _] = useState(true);

    function loadJSON() {
        // already loaded
        if (size.n !== 0) return
        if (testing) {
            parseJSON(testData)
            return <></>
        }
        return <input type="file" onChange={handleChange}/>
    }

    const parseJSON = (data) => {
        setSeq(data["paths"]);
        setSize({n: data.n, m: data.m})
    }

    function handleChange(event) {
        const file = event.target.files[0]
        if (file['type'] === 'application/json') {
            let reader = new FileReader();
            reader.onload = (event) => parseJSON(JSON.parse(event.target.result.toString()))
            reader.readAsText(file);

        }
    }

    loadJSON()
    if (!seq) {
        return <div>Loading..</div>
    }
    return (
        <main>
            <section className="gridHolder">
                <Grid_v2 n={size.n} m={size.m} positions={seq}/>
            </section>
        </main>
    );
}
