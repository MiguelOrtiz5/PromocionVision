import { config } from '@keystone-6/core';
import { lists } from './Schema/Schema';

export default config({
  server: {
    port: 3000, // Puerto en el que se ejecutará Keystone
    cors: {
      origin: [
        'http://localhost:8081', // Permitir el frontend local
        'http://192.168.1.0/24', // Permitir cualquier dispositivo dentro de la red local
        'http://192.168.148.2', //ip raspberry
      ],
      credentials: true, // Necesario si usas cookies o autenticación
    },
  },
  db: {
    provider: 'sqlite',
    url: 'file:./db/classtrack.db', // Ruta de la base de datos SQLite
  },
  lists,
  //session,
});
