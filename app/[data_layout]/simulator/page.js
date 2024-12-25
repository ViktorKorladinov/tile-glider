'use client'
import {useEffect, useState} from "react"
import '../grid.css'
import Grid_v2 from "../Grid_v2";
import Image from "next/image";
import { useParams } from 'next/navigation'

export default function Simulator() {
    const [simulationData, setSimData] = useState();
    const [size, setSize] = useState({ n: 0, m: 0, fill: false });
    const params = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/loadJson?id=${params.data_layout}`);
            const jsonData = await response.json();
            setSimData(jsonData);
            let moverPaths = jsonData['mover_paths'];
            setSize({n: moverPaths.m, m: moverPaths.n, fill: moverPaths['filled']});
        };
        void fetchData();
    }, [params.data_layout]);


    if (!simulationData) {
        return (
            <main>
                < p>Loading Files..</p>
            </main>
        )
    }
    return (
        <main>

            <div id="logo">
                <Image id="aa" fill={true} alt="CIIRC Logo" src={"../ciirc.svg"} />
            </div>
            <section className="gridHolder">
                <Grid_v2 n={size.n} m={size.m} fill={size.fill} simulationData={simulationData} />
            </section>
        </main>
    );
}
