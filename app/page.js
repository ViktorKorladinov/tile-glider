import fs from 'fs';
import path from 'path';

export default function Home() {
  const jsonFiles = fs.readdirSync('public')
    .filter(file => path.extname(file) === '.json');

  return (
    <div>
      <h1>Available JSON Files</h1>
      <ul>
        {jsonFiles.map(file => (
          <li key={file}>
            <a href={`/simulator/${path.parse(file).name}`}>{file}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}