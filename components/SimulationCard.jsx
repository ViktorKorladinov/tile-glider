import { useRouter } from 'next/navigation';
import { TbTruck, TbUsers } from 'react-icons/tb';
import { HiBeaker } from 'react-icons/hi';
import Image from 'next/image';

const SimulationCard = ({ file, id }) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/${id}/simulator`)}
            className="w-[300px] min-h-[350px] rounded-lg overflow-hidden shadow-md transition-shadow duration-200 bg-white hover:shadow-lg cursor-pointer"
        >
            <div className="bg-blue-200 p-2 text-gray-800">
                <h2 className="m-0 text-xl font-medium capitalize">{file.topology} simulation</h2>
            </div>
            <div className="card-content p-4 flex flex-col justify-between h-[90%]">
                <Image
                    fill={true}
                    src={`layouts/${file.topology}.svg`}
                    alt="Simulation Image"
                />
                <ul className="list-none p-0 m-0">
                    <li className="flex items-center gap-2 text-gray-700 mb-3 last:mb-0">
                        <span className="w-5 h-5 flex items-center justify-center">
                            <HiBeaker />
                        </span>
                        <span>Dose: {file.dose}</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700 mb-3 last:mb-0">
                        <span className="w-5 h-5 flex items-center justify-center">
                            <TbTruck />
                        </span>
                        <span>Movers: {file.movers}</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                        <span className="w-5 h-5 flex items-center justify-center">
                            <TbUsers />
                        </span>
                        <span>Patients: {file.patients}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SimulationCard;
