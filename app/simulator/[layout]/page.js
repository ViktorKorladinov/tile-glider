'use client'
import { useState } from "react"
import '../grid.css'
// import testData from '../test.json'
import Grid_v2 from "../Grid_v2";
import Image from "next/image";
import { useParams } from 'next/navigation'

export default function Simulator() {
    const [seq, setSeq] = useState();
    const [size, setSize] = useState({ n: 0, m: 0 });
    const params = useParams()
    console.log(params)
    // const [testing, _] = useState(true);

    // function loadJSON() {
    //     // already loaded
    //     if (size.n !== 0) return
    //     if (testing) {
    //         parseJSON(testData)
    //         return <></>
    //     }
    // }

    const parseJSON = (data) => {
        setSeq(data["paths"]);
        setSize({ n: data.n, m: data.m })
    }

    function handleChange(event) {
        const file = event.target.files[0]
        if (file['type'] === 'application/json') {
            let reader = new FileReader();
            reader.onload = (event) => {
                parseJSON(JSON.parse(event.target.result.toString()))
                // console.log(event.target.result.toString())
            }
            reader.readAsText(file);

        }
    }
    // console.log('ahoj')
    // import('../test.json').then(a=> console.log(a.paths)).catch(reason => console.log(reason))

    if (!seq) {
        return (
            <main>
                <input type="file" onChange={handleChange} />
            </main>
        )
    }
    return (
        <main>

            <div id="logo">
                <Image id="aa" fill={true} alt="CIIRC Logo" src={"./ciirc.svg"} />
            </div>
            <section className="gridHolder">
                <Grid_v2 n={size.n} m={size.m} positions={seq} />
            </section>
        </main>
    );
}
