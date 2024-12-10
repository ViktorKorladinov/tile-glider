import fs from 'fs';
import path from 'path';

export default function Home() {
    function getDirectories(srcPath) {
        return fs.readdirSync(srcPath).filter(file => {
            return fs.statSync(path.join(srcPath, file)).isDirectory();
        });
    }

    function extractSimulationData(simulationFolder) {
        const resultsFilePath = path.join(simulationFolder, 'results.json');

        try {
            const resultsData = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
            const {dose, movers, patients} = resultsData.config;
            return {dose, movers, patients};
        } catch (error) {
            console.error(`Error reading results.json for ${simulationFolder}:`, error);
            return null;
        }
    }

    function processSimulationFolder(folderPath) {
        const simulationData = extractSimulationData(folderPath);
        if (simulationData) {
            simulationData.folderPath = folderPath;
        }
        return simulationData
    }


    const directories = getDirectories('public/simulations');

    const simulationsData = directories.map(dir => {
        const folderPath = path.join('public/simulations', dir);
        return processSimulationFolder(folderPath)
    })
    console.log({simulationsData})

    return (
        <div>
            <h1>Available Simulations</h1>
            <ul>
                {simulationsData.map((file, id) => (
                    <li key={`simulation-${id}`}>
                        <a href={`/${id}/simulator`}>
                            {`Simulation with dose ${file.dose}, ${file.movers} movers and ${file.patients} patients`}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}