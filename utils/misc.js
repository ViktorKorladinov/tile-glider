import fs from "fs";

export function createIcons() {

// Shape drawing functions
    const shapes = {
        square: (x, y, size) => `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="black" stroke-width="2"/>`,
    };

    const createGrid = (x, y = x, filled = true, cellSize = 100) => {
        const gridSizeX = cellSize * x;
        const gridSizeY = cellSize * y;
        let grid = '';

        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                if (filled || i === 0 || i === x - 1 || j === 0 || j === y - 1)
                    grid += shapes.square(i * cellSize, j * cellSize, cellSize);
            }
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gridSizeX} ${gridSizeY}">
    ${grid}
  </svg>`;
    };

// Save the SVG
    if (!fs.existsSync('public/layouts'))
        fs.mkdirSync('public/layouts/');
    fs.writeFileSync('public/layouts/square.svg', createGrid( 4));
    fs.writeFileSync('public/layouts/doubleline.svg', createGrid(8, 2, true, 50));
    fs.writeFileSync('public/layouts/line.svg', createGrid(10,1,true,40));
    fs.writeFileSync('public/layouts/ring.svg', createGrid(4,4,false,100));

}