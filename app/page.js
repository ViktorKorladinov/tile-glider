'use client'
import {useCallback, useEffect, useState} from "react";
import '@/styles/portal.css'
import SimulationCard from "@/components/SimulationCard";

export default function Home() {
    const [parsedSimulations, setParsedSimulations] = useState([]);
    const [selectedLayouts, setSelectedLayouts] = useState(['Ring', 'Square', 'DoubleLine', 'SingleLine']);

    const toggleLayout = (layout) => {
        setSelectedLayouts(prev => prev.includes(layout) ? prev.filter(l => l !== layout) : [...prev, layout]);
    };

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

    return (<div className="flex flex-col items-center justify-center">
        <h1>Available Simulations</h1>
        <div className=" p-4 bg-gray-100 rounded-lg shadow-sm">
            <ul className="flex space-x-2">
                {['Ring', 'Square', 'DoubleLine', 'SingleLine'].map(layout => {
                    let calculatedName = 'px-4 py-2 rounded-md cursor-pointer transition-colors '
                    if (selectedLayouts.includes(layout)) {
                        calculatedName += 'bg-blue-500 text-white hover:bg-blue-600'
                    } else {
                        calculatedName += 'bg-white text-gray-700 hover:bg-gray-200'
                    }
                    return (
                        <li key={layout} onClick={() => toggleLayout(layout)} className={calculatedName}>
                            {layout}
                        </li>);
                })}
            </ul>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-center p-5 w-[90%]">
            {renderSimulations()}
        </div>
    </div>);
}