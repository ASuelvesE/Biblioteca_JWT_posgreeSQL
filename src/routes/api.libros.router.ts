import express, { Request, Response } from 'express';
import IApiLibrosRepository from '../repositories/api.libros.Irepository';
import ApiLibrosRepositoryMySQL from '../repositories/api.libros.repositorymysql';
import Libro from '../models/Libro';
import { isAuth, isBibliotecario } from '../security/auth';
import Bibliotecario from '../models/Bibliotecario';
import Usuario from '../models/Usuario';

const router = express.Router()

const librosRepository: IApiLibrosRepository = new ApiLibrosRepositoryMySQL();

router.get('/', async (req: Request, res: Response) => {
    try {
        const libros: Libro[] = await librosRepository.findAll();
        res.send(libros);
    }
    catch (error) {
        res.send(error)
    }
})
router.get('/prestamos', isAuth, isBibliotecario, async (req: Request, res: Response) => {
    try {
        const libros: Libro[] = await librosRepository.findAllPrestamos();
        res.send(libros);
    }
    catch (error) {
        res.send(error)
    }
})
router.get('/:codigo/prestamos', isAuth, isBibliotecario, async (req: Request, res: Response) => {
    try {
        const codigo: Number = Number(req.params.codigo);
        const libro: Libro = await librosRepository.findAllPrestamosByLibro(codigo);
        res.send(libro);
    }
    catch (error) {
        res.send(error)
    }
})
router.put('/libro/:codigo', isAuth, isBibliotecario, async (req: Request, res: Response) => {
    try {
        const codigo: Number = Number(req.params.codigo);
        const usuarioAutorizado: Usuario = req.body.auth;
        const response: Boolean = await librosRepository.devuelveLibro(codigo, usuarioAutorizado);
        if (response)
            res.send("Libro devuelto");
        else
            res.send("Libro NO devuelto");
    }
    catch (error) {
        res.send(error)
    }
})


export { router as routerApiLibros };