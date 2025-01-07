'use client';
import {useCallback, useEffect, useState} from 'react';
import '@/styles/portal.css';
import SimulationCard from '@/components/SimulationCard';
import SegmentedRange from '@/components/FilterCategories/SegmentedRange';
import Image from 'next/image';

export default function Home() {
  const [parsedSimulations, setParsedSimulations] = useState([]);
  const [selectedLayouts, setSelectedLayouts] = useState([]);
  const [patientRange, setPatientRange] = useState([0, 100]);
  const [moverRange, setMoverRange] = useState([0, 100]);
  const [key, setKey] = useState('0');

  const toggleLayout = (layout) => {
    setSelectedLayouts(prev => {
      if (prev.includes(layout)) {
        return prev.filter(l => l !== layout);
      } else return [...prev, layout];
    });
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
    // if (parsedSimulations.length === 0) return (<h2>No simulations to be shown</h2>);
    return parsedSimulations.filter(simulation => patientRange.some(
        patientRange => simulation.patients >= patientRange.start &&
            simulation.patients <= patientRange.end) && moverRange.some(
        moverRange => simulation.movers >= moverRange.start &&
            simulation.movers <= moverRange.end) && (selectedLayouts.some(
            layout => simulation.topology.toLowerCase() === layout.toLowerCase()) ||
        selectedLayouts.length === 0)).
        map((file, id) => <SimulationCard simulationDetail={file}
                                          key={`simCard${id}`} id={id}/>);
  }, [moverRange, parsedSimulations, patientRange, selectedLayouts]);

  return (<>
    <div className="absolute left-4 w-28 h-28">
      <Image id="aa" fill={true} alt="CIIRC Logo" src='/ciirc.svg'/>
    </div>
    <div className="flex flex-col items-center justify-center">

      <h1 className="p-4 text-3xl">Available Simulations</h1>
      {/*<div*/}
      {/*    className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">*/}
      {/*  Layout:*/}
      {/*  <ul className="flex space-x-2 h-10">*/}
      {/*    {['Ring', 'Square', 'DoubleLine', 'SingleLine'].map(layout => {*/}
      {/*      let calculatedName = 'px-4 py-2 rounded-md cursor-pointer transition-colors ';*/}
      {/*      if (selectedLayouts.includes(layout)) {*/}
      {/*        calculatedName += 'bg-blue-500 text-white hover:bg-blue-600';*/}
      {/*      } else {*/}
      {/*        calculatedName += 'bg-white text-gray-700 hover:bg-gray-200';*/}
      {/*      }*/}
      {/*      return (<li key={layout} onClick={() => toggleLayout(layout)}*/}
      {/*                  className={calculatedName}>*/}
      {/*        {layout}*/}
      {/*      </li>);*/}
      {/*    })}*/}
      {/*  </ul>*/}
      {/*  Patients:*/}
      {/*  <div className="flex-grow">*/}
      {/*    <SegmentedRange key={`PatientRange${key}`} min={0} max={100}*/}
      {/*                    intervals={4}*/}
      {/*                    onChange={setPatientRange}/>*/}
      {/*  </div>*/}
      {/*  Movers:*/}
      {/*  <div className="flex-grow">*/}
      {/*    <SegmentedRange key={`MoverRange${key}`} min={0} max={20}*/}
      {/*                    intervals={4}*/}
      {/*                    onChange={setMoverRange}/>*/}
      {/*  </div>*/}
      {/*  <div*/}
      {/*      className="px-4 py-2 rounded-md cursor-pointer transition-colors border-red-600 border text-red-700 hover:bg-red-700 hover:text-white"*/}
      {/*      onClick={() => {*/}
      {/*        setKey(key => key === '0' ? '1' : '0');*/}
      {/*        setSelectedLayouts([]);*/}
      {/*      }}>*/}
      {/*    Clear*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 justify-items-center p-5 w-[90%]">
        {renderSimulations()}
      </div>
    </div>
  </>)
      ;
}