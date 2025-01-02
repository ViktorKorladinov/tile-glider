'use client'
import {useCallback, useEffect, useState} from "react";
import '@/styles/portal.css'
import SimulationCard from "@/components/SimulationCard";

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

    const renderSimulations = useCallback(() => {
        return parsedSimulations.map((file, id) => <SimulationCard file={file} key={`simCard${id}`} id={id}/>)
    }, [parsedSimulations]);

    return (<div className={'simulations-container'}>
        <h1>Available Simulations</h1>
        <div className={"simulations-filters"}>

        </div>
        <div className={"card-container"}>{renderSimulations()}</div>
    </div>);
}