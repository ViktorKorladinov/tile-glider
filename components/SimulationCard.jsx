import {useRouter} from 'next/navigation';
import {TbClock, TbTruck, TbUsers} from 'react-icons/tb';
import {HiBeaker} from 'react-icons/hi';
import Image from 'next/image';
import {formatTimestamp} from '@/utils/timeParser';

const SimulationCard = ({simulationDetail}) => {
  const router = useRouter();

  return (<div
          onClick={() => router.push(`/${simulationDetail.id}/simulator`)}
          className="w-[300px] min-h-[350px] rounded-lg overflow-hidden shadow-md transition-shadow duration-200 bg-white hover:shadow-lg cursor-pointer"
      >
        <div className="bg-blue-200 p-2 text-gray-800">
          <h2 className="m-0 text-xl font-medium capitalize">{simulationDetail.topology} simulation</h2>
        </div>
        <div className="card-content p-4 flex flex-col justify-between h-[90%]">
          <Image
              fill={true}
              src={`layouts/${simulationDetail.topology}.svg`}
              alt="Simulation Image"
          />
          <ul className="list-none p-0 m-0">
            <li className="flex items-center gap-2 text-gray-700 mb-3 last:mb-0">
                        <span
                            className="w-5 h-5 flex items-center justify-center">
                            <HiBeaker/>
                        </span>
              <span>Dose: {simulationDetail.dose}</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 mb-3 last:mb-0">
                        <span
                            className="w-5 h-5 flex items-center justify-center">
                            <TbTruck/>
                        </span>
              <span>Movers: {simulationDetail.movers}</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700 mb-3 last:mb-0">
                        <span
                            className="w-5 h-5 flex items-center justify-center">
                            <TbUsers/>
                        </span>
              <span>Patients: {simulationDetail.patients}</span>
            </li>
            <li className="flex items-center gap-2 text-gray-400">
                        <span
                            className="w-5 h-5 flex items-center justify-center">
                            <TbClock/>
                        </span>
              <span>{formatTimestamp(simulationDetail.calculated_at)}</span>
            </li>
          </ul>
        </div>
      </div>);
};

export default SimulationCard;
