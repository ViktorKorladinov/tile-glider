import fs from 'fs';
import path from 'path';

async function loadJsonFiles(id) {
    const publicPath = path.join(process.cwd(), 'public/simulations');
    const simulations_folder = await fs.promises.readdir(publicPath, {withFileTypes: true});

    // Get only directories, sorted alphabetically
    const directories = simulations_folder
        .filter(entity => entity.isDirectory())
        .map(dir => dir.name)
        .sort();

    // Get directory at specified index
    const targetDir = directories[parseInt(id)];
    if (!targetDir) {
        throw new Error(`No directory found at index ${id}`);
    }

    const dirPath = path.join(publicPath, targetDir);

    try {
        const files_dict = await fs.promises.readFile(path.join(dirPath, 'files.json'), 'utf-8');
        const jsonFiles = JSON.parse(files_dict);

        const fileEntries = await Promise.all(
            Object.entries(jsonFiles).map(async ([name, file],_) => {
                const filePath = path.join(dirPath, file);
                const content = await fs.promises.readFile(filePath, 'utf-8');
                const parsed = JSON.parse(content);
                return [name, parsed];
            })
        );
        return Object.fromEntries(fileEntries);

    } catch (error) {
        console.error('Error loading JSON files:', error);
        return [];
    }
}

export {loadJsonFiles};