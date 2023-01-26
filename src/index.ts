import express from 'express';
import dotenv from "dotenv"
import cors from 'cors';

dotenv.config()

const app = express();
app.use(express.json())
const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options));

app.use(express.static(__dirname + '/public'));



const port = process.env.PORT


//routers

import { routerApiLibros } from './routes/api.libros.router'
import { routerApiUsuarios } from './routes/api.usuarios.router'
import { routerApiAuth } from './routes/api.auth.router'

app.use('/api/libros',routerApiLibros)
app.use('/api/usuarios',routerApiUsuarios)
app.use('/api/auth',routerApiAuth)

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${port}`);
});