'use client'
import {useEffect, useState} from "react";


export default function Home() {
    const [parsedSimulations, setParsedSimulations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/parseSimulations`);
            const jsonData = await response.json();
            setParsedSimulations(jsonData);
        };
        void fetchData();
    }, []);

    return (<div>
            <h1>Available Simulations</h1>
            <ul>
                {parsedSimulations.map((file, id) => (<li key={`simulation-${id}`}>
                        <a href={`/${id}/simulator`}>
                            {`Simulation [${file.topology}] with dose ${file.dose}, ${file.movers} movers and ${file.patients} patients`}
                        </a>
                    </li>))}
            </ul>
        </div>);
}