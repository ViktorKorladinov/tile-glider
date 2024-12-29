import path from "path";
import fs from 'fs';

function getDirectories(srcPath) {
    const a = fs.readdirSync(srcPath).filter(file => {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
    });
    console.log(a.name);
    return a
}

function extractSimulationData(simulationFolder) {
    const resultsFilePath = path.join(simulationFolder, 'results.json');

    try {
        const resultsData = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
        const {dose, movers, patients} = resultsData.config
        const topology = resultsData.config.topology_info.topology
        return {dose, movers, patients, topology};
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

export function parseSimulations(folderPath) {
    const directories = getDirectories(folderPath).sort((a, b) => a.localeCompare(b));
    return directories.map(dir => {
        const folderPath = path.join('public/simulations', dir);
        return processSimulationFolder(folderPath)
    });
}
