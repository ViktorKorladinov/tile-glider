import path from 'path';
import fs from 'fs';

function getDirectories(srcPath) {
  if (!fs.existsSync(srcPath))
    return [];
  return fs.readdirSync(srcPath).filter(file => {
    return fs.statSync(path.join(srcPath, file)).isDirectory();
  });
}

function extractSimulationData(simulationFolder) {
  const resultsFilePath = path.join(simulationFolder, 'results.json');

  try {
    const resultsData = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
    const {dose, movers, patients} = resultsData.config;
    const topology = resultsData.config['topology_info'].topology;
    let calculated_at = 'unknown';
    if (resultsData.results['calculated_at'])
      calculated_at = resultsData.results['calculated_at'];
    return {dose, movers, patients, topology, calculated_at};
  } catch (error) {
    console.error(`Error reading results.json for ${simulationFolder}:`, error);
    return null;
  }
}

function processSimulationFolder(folderPath, id) {
  const simulationData = extractSimulationData(folderPath);
  if (simulationData) {
    simulationData.folderPath = folderPath;
    simulationData.id = id;
  }
  return simulationData;
}

export function parseSimulations(folderPath) {
  const directories = getDirectories(folderPath).
      sort((a, b) => a.localeCompare(b));
  return directories.map((dir, id) => {
    const folderPath = path.join('public/simulations', dir);
    return processSimulationFolder(folderPath, id);
  });
}
