import fs from 'fs';
import path from 'path';

async function loadJsonFiles(id) {
    const publicPath = path.join(process.cwd(), 'public/simulations');
    const dirs = await fs.promises.readdir(publicPath, { withFileTypes: true });

    // Get only directories, sorted alphabetically
    const directories = dirs
        .map(dirent => dirent.name)

    // Get directory at specified index
    const targetDir = directories[parseInt(id)];
    if (!targetDir) {
        throw new Error(`No directory found at index ${id}`);
    }

    const dirPath = path.join(publicPath, targetDir);

    try {
        const files = await fs.promises.readdir(dirPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        return await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(dirPath, file);
                const content = await fs.promises.readFile(filePath, 'utf-8');
                return JSON.parse(content);
            })
        );
    } catch (error) {
        console.error('Error loading JSON files:', error);
        return [];
    }
}

export { loadJsonFiles };