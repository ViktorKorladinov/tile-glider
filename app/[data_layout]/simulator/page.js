'use client'
import {useEffect, useState} from "react"
import '../../../styles/grid.css'
import Grid from "../../../components/Grid";
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
            <div className="absolute left-4 w-28 h-28">
                <Image id="aa" fill={true} alt="CIIRC Logo" src={"../../ciirc.svg"} />
            </div>
            <section className="gridHolder">
                <Grid n={size.n} m={size.m} fill={size.fill} simulationData={simulationData} />
            </section>
        </main>
    );
}
