import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISTRICTS_URL = 'https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json';
const UPAZILAS_URL = 'https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json';

const OUTPUT_DIR = path.join(__dirname, 'src', 'assets');

async function fetchAndCleanData() {
  try {
    console.log('Fetching districts from nuhil/bangladesh-geocode...');
    const districtsRes = await fetch(DISTRICTS_URL);
    if (!districtsRes.ok) throw new Error(`Districts fetch failed: ${districtsRes.statusText}`);
    const districtsRaw = await districtsRes.json();

    console.log('Fetching upazilas from nuhil/bangladesh-geocode...');
    const upazilasRes = await fetch(UPAZILAS_URL);
    if (!upazilasRes.ok) throw new Error(`Upazilas fetch failed: ${upazilasRes.statusText}`);
    const upazilasRaw = await upazilasRes.json();

    // Find the tables in phpMyAdmin export structure
    const districtsTable = districtsRaw.find(item => item.type === 'table' && item.name === 'districts');
    if (!districtsTable) throw new Error('Districts table data not found in JSON');
    
    const upazilasTable = upazilasRaw.find(item => item.type === 'table' && item.name === 'upazilas');
    if (!upazilasTable) throw new Error('Upazilas table data not found in JSON');

    // Clean and sort districts
    const districts = districtsTable.data
      .map(d => ({ id: d.id, name: d.name.trim() }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Clean and sort upazilas
    const upazilas = upazilasTable.data
      .map(u => ({ id: u.id, district_id: u.district_id, name: u.name.trim() }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write districts.js
    const districtsContent = `// Bangladesh Districts (Sorted alphabetically)\nexport const districts = ${JSON.stringify(districts, null, 2)};\n`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'districts.js'), districtsContent, 'utf-8');
    console.log(`Successfully wrote ${districts.length} districts to src/assets/districts.js`);

    // Write upazilas.js
    const upazilasContent = `// Bangladesh Upazilas (Sorted alphabetically)\nexport const upazilas = ${JSON.stringify(upazilas, null, 2)};\n`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'upazilas.js'), upazilasContent, 'utf-8');
    console.log(`Successfully wrote ${upazilas.length} upazilas to src/assets/upazilas.js`);

  } catch (err) {
    console.error('Error fetching and cleaning geocode data:', err);
    process.exit(1);
  }
}

fetchAndCleanData();
