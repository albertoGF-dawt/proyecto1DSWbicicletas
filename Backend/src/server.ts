import express from 'express';
import { sequelize } from './config/database';
import { defineAssociations } from './models/associations'; //

// Importar los modelos para que Sequelize los reconozca al sincronizar[cite: 1]
import './modules/brands/brand.model';
import './modules/bicycles/bicycles.model';

import routes from './routes/index';

const app = express();
app.use(express.json());
app.use('/api', routes);

async function startServer() {
    try {
        defineAssociations();
        await sequelize.authenticate();

        await sequelize.sync({ alter: true });

        console.log('Base de datos conectada y tablas sincronizadas correctamente.');

        app.listen(3000, () => {
            console.log('Servidor escuchando en http://localhost:3000');
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

startServer();