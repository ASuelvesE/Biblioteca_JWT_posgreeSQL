import express, { Request, Response } from 'express';
import Usuario from "../models/Usuario";
import Prestamos from "../models/Prestamo";
import IApiUsuariosRepository from '../repositories/api.usuarios.Irepository';
import ApiUsuariosRepositoryMySQL from '../repositories/api.usuarios.repositorymysql';
import { isAuth, isBibliotecario } from '../security/auth';

const router = express.Router()

const usuariosRepository: IApiUsuariosRepository = new ApiUsuariosRepositoryMySQL();

router.get('/',isAuth, isBibliotecario, async (req: Request, res: Response) => {
    try {       
        const user: Usuario = req.body.auth;
        const usuarioPrestamos: Usuario[] = await  usuariosRepository.getPrestamosAll();
        res.json(usuarioPrestamos);
    }
    catch (error) {
        res.send(error)
    }
})
router.get('/prestamos', isAuth, async (req: Request, res: Response) => {
    try {       
        const user: Usuario = req.body.auth;
        const prestamos: Prestamos[] = await usuariosRepository.getPrestamosByUser(user);
        res.json(prestamos);
    }
    catch (error) {
        res.send(error)
    }
})

export { router as routerApiUsuarios};