import path from 'path';
import fs from 'fs';

function getDirectories(srcPath) {
  if (!fs.existsSync(srcPath))
    return [];
  return fs.readdirSync(srcPath).filter(file => {
    return fs.statSync(path.join(srcPath, file)).isDirectory();
  });
}

function extractSimulationData(simulationFolder) {{
    const resultsFilePath = path.join(simulationFolder, 'results.json');

    try {
      // Read the results file
      const resultsData = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
      const { dose, movers, patients } = resultsData.config;
      const topologyInfo = resultsData.config['topology_info'];

      if (!topologyInfo['n_dispensers']) {
        try {
          const mPath = path.join(simulationFolder, 'medicine.json');
          const medicineData = JSON.parse(fs.readFileSync(mPath, 'utf8'));
          topologyInfo['n_dispensers'] = Object.entries(medicineData)
          .reduce((sum, [name, locations]) => {
            if(name.toLowerCase() === 'interface')
              return sum
            return sum + locations.length;
          }, 0);

          // Save the updated topology info back to the results file
          resultsData.config['topology_info'] = topologyInfo;
          fs.writeFileSync(resultsFilePath, JSON.stringify(resultsData, null, 2), 'utf8');
        } catch (_) {
          topologyInfo['n_dispensers'] = topologyInfo['n_tiles'];
        }
      }else{
        // no need to calculate the amount of dispensers, information is already there
        // console.log('present!');
      }

      const filteredTopologyInfo = {
        topology: topologyInfo.topology,
        n_tiles: topologyInfo.n_tiles,
        n_interfaces: topologyInfo.n_interfaces,
        n_dispensers: topologyInfo.n_dispensers,
      };

      let calculated_at = 'unknown';
      if (resultsData.results['calculated_at']) {
        calculated_at = resultsData.results['calculated_at'];
      }

      return {
        dose,
        movers,
        patients,
        topologyInfo: filteredTopologyInfo,
        calculated_at,
      };
    } catch (error) {
      console.error(`Error reading results.json for ${simulationFolder}:`, error);
      return null;
    }
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
