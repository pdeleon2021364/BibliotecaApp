import 'dotenv/config';
import { initServer } from './configs/app.js';

process.on('uncaughtException', (err)=> {
    console.error('Uncought Exception in Servicio A (Biblioteca):', err);
    process.exit(1);
})

process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', err);
    process.exit(1);
})

console.log('Starting Servicio A - Biblioteca...');
initServer();
