import {useRouter} from 'next/navigation';
import {TbTruck, TbUsers} from 'react-icons/tb';
import {HiBeaker} from "react-icons/hi";
import Image from "next/image";

const SimulationCard = ({file, id}) => {
    const router = useRouter();

    return (<div onClick={() => router.push(`/${id}/simulator`)} className="card">
            <div className="card-header">
                <h2 className="card-title">{file.topology} simulation</h2>
            </div>
            <div className="card-content">
                <Image fill={true} src={`layouts/${file.topology}.svg`} alt="Simulation Image"/>
                <ul className="stats-list">
                    <li className="stat-item">
                        <span className="stat-icon"><HiBeaker/></span>
                        <span>Dose: {file.dose}</span>
                    </li>
                    <li className="stat-item">
                        <span className="stat-icon"><TbTruck/></span>
                        <span>Movers: {file.movers}</span>
                    </li>
                    <li className="stat-item">
                        <span className="stat-icon"><TbUsers/></span>
                        <span>Patients: {file.patients}</span>
                    </li>
                </ul>
            </div>
        </div>);
};

export default SimulationCard;
