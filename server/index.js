import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';
import DBconnection from './database/db.js';

const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use('/', router);

DBconnection(); 

const PORT = process.env.PORT || 8000; // Using 8000 as a default fallback port
// Start the server
app.listen(PORT, () => console.log(`Server running at ${PORT}`));