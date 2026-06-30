import fs from 'fs';

const dirPath = './src/environments';
const localPath = `${dirPath}/environment.ts`;
const prodPath = `${dirPath}/environment.prod.ts`;

// 1. Asegurar que la carpeta exista en el contenedor de Linux de Netlify
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
  console.log('📁 Carpeta src/environments creada dinámicamente.');
}

// 2. El contenido con tus variables de Netlify
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

// 3. Escribir AMBOS archivos para que el fileReplacements de Angular no falle
fs.writeFileSync(localPath, envConfigFile);
fs.writeFileSync(prodPath, envConfigFile);

console.log('✅ Entorno e inyección de Firebase listos para Angular.');