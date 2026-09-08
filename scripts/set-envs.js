const { error } = require('console');
const { writeFileSync, mkdirSync } = require('fs')

require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';


if (!process.env['MAPBOX_KEY']) {
  throw new error('MAPBOX_KEY is required')
}
const envFileContent = `
export const environment = {
mapboxKey: "${process.env['MAPBOX_KEY']}"
};

`

mkdirSync('./src/environments', { recursive: true })

writeFileSync( targetPath, envFileContent)
writeFileSync( targetPathDev, envFileContent)
