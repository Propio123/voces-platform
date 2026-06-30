import fs from 'fs';
import path from 'path';

const dirPath = './src/environments';
const targetPath = `${dirPath}/environment.prod.ts`;

// ASEGURAR QUE LA CARPETA EXISTA (Si no existe en Netlify, Linux la creará aquí)
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
  console.log('📁 Carpeta src/environments creada dinámicamente.');
}

const envConfigFile = `export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.MY_FIREBASE_API_KEY}',
    authDomain: '${process.env.MY_FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.MY_FIREBASE_PROJECT_ID}',
    storage_bucket: '${process.env.MY_FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.MY_FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.MY_FIREBASE_APP_ID}'
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log('✅ Variables de Firebase inyectadas correctamente.');