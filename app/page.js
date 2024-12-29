'use client'
import {useCallback, useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import '@/app/portal.css'

export default function Home() {
    const [parsedSimulations, setParsedSimulations] = useState([]);
    const router = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/parseSimulations`);
            const jsonData = await response.json();
            setParsedSimulations(jsonData);
        };
        void fetchData();
    }, []);

    const renderSimulations = useCallback(() => {
        return parsedSimulations.map((file, id) => {
            return (
                <div key={`simCard${id}`} onClick={()=>router.push(`/${id}/simulator`)} className="card">
                    <div className="card-header">
                        <h2 className="card-title">{file.topology} simulation</h2>
                    </div>
                    <div className="card-content">
                        <img src={`layouts/${file.topology}.svg`} alt="Simulation Image" />

                        <ul className="stats-list">
                            <li className="stat-item">
                                <span className="stat-icon">📊</span>
                                <span>Dose: {file.dose}</span>
                            </li>
                            <li className="stat-item">
                                <span className="stat-icon">👥</span>
                                <span>Movers: {file.movers}</span>
                            </li>
                            <li className="stat-item">
                                <span className="stat-icon">👤</span>
                                <span>Patients: {file.patients}</span>
                            </li>
                        </ul>
                    </div>
                </div>)
        })
    }, [parsedSimulations]);

    return (<div className={'simulations-container'}>
        <h1>Available Simulations</h1>
        <div className={"card-container"}>{renderSimulations()}</div>

    </div>);
}