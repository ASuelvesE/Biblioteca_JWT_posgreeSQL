import express, { Request, Response } from 'express';
import Bibliotecario from '../models/Bibliotecario';
import Usuario from '../models/Usuario';
import IApiUsuariosRepository from '../repositories/api.usuarios.Irepository';
import ApiUsuariosRepositoryMySQL from '../repositories/api.usuarios.repositorymysql';
import ApiBibliotecariosRepositoryMySQL from "../repositories/api.bibliotecarios.repositorymysql"
import IApiBibliotecariosRepository from '../repositories/api.bibliotecarios.Irepository';

const router = express.Router()

const usuariosRepository: IApiUsuariosRepository = new ApiUsuariosRepositoryMySQL();
const bibliotecariosRepository: IApiBibliotecariosRepository = new ApiBibliotecariosRepositoryMySQL();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const user: Usuario = {
            alias: req.body.alias,
            password: req.body.password,
        };
        if (req.body.secret) {
            if (req.body.secret === "claveadmins") {
                const bibliotecario: Bibliotecario = {
                    user: user
                }
                const bibliotecarioCreate: Boolean = await bibliotecariosRepository.create(bibliotecario);
                res.json(bibliotecarioCreate);
            }
        } else {
            const userCreate: Boolean = await usuariosRepository.createUser(user);
            res.json(userCreate);
        }
    }
    catch (error) {
        res.send(error)
    }
})
router.post('/', async (req: Request, res: Response) => {
    try {
        const user: Usuario = {
            alias: req.body.alias,
            password: req.body.password,
        };
        if (req.body.secret) {
            if (req.body.secret === "claveadmins") {
                const bibliotecario: Bibliotecario = {
                    user: user
                }
                const bibliotecarioLogin: Bibliotecario = await bibliotecariosRepository.login(bibliotecario);
                res.json(bibliotecarioLogin);
            }
        } else {
            const userLogin: Usuario = await usuariosRepository.loginUser(user);
            res.json(userLogin);
        }
    }
    catch (error) {
        res.send(error)
    }
})


export { router as routerApiAuth };