import executeQuery from '../db/posgres/posgres.connector'
import Usuario from '../models/Usuario';
import { hash, compare } from "../security/encrypter";
import { createToken, isAuth } from "../security/auth";
import IApiUsuariosRepository from './api.usuarios.Irepository';
import Prestamo from '../models/Prestamo';
import Libro from '../models/Libro';


export default class ApiUsuariosRepositoryMySQL implements IApiUsuariosRepository {

    async createUser(user: Usuario): Promise<Boolean> {
        try {
            if(user.password){
                const sql: string = `insert into usuarios values('${user.alias}','${hash(user.password)}')`;
                await executeQuery(sql);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async loginUser(user: Usuario): Promise<Usuario> {
        try {
            const sql: string = `select * from usuarios where alias = '${user.alias}'`;
            const userDB: any[] = await executeQuery(sql);
            if (userDB && user.password) {
                if (compare(user.password, userDB[0].password)) {
                    user.password = userDB[0].password;
                    user.token = createToken(user);
                }
            }
            return user;
        } catch (error) {
            console.error(error);
            return user;
        }
    }
    async getPrestamosByUser(user: Usuario): Promise<Prestamo[]> {
        const prestamos: Prestamo[] = [];
        try {
            const sql: string = `select * 
            from prestamos p
            join libros l on l.codigo = p.libro
            where p.usuario = '${user.alias}'`;
            const prestamosDB: any[] = await executeQuery(sql);
            for (let prestamoDB of prestamosDB) {
                const prestamo: Prestamo = {
                    codigo: prestamoDB.libro,
                    titulo: prestamoDB.titulo,
                    inicio: prestamoDB.inicio,
                    fin: prestamoDB.fin
                }
                prestamos.push(prestamo);
            }
            return prestamos;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async getPrestamosAll(): Promise<Usuario[]> {
        const usuariosPrestamos: Usuario[] = [];

        try {
            const sql = `select u.alias,p.libro,l.titulo
            from usuarios u
            join prestamos p on p.usuario = u.alias
            join libros l on l.codigo = p.libro`;
            const prestamosDB: any[] = await executeQuery(sql);
            for (let prestamoDB of prestamosDB) {
                const newUsuario: Usuario = {
                    alias: prestamoDB.alias,
                    prestamos: []
                }
                const libro: Libro = {
                    codigo: prestamoDB.libro,
                    titulo: prestamoDB.titulo
                }
                const usuarioPrestamo: Usuario | undefined = usuariosPrestamos.find((usuario) => { //Si sale undefined no lo teniamos en el array
                    return usuario.alias === prestamoDB.alias
                });

                if (usuarioPrestamo) { //Si ya lo teniamos... entonces solo le añadimos el libro
                    usuarioPrestamo.prestamos?.push(libro)
                } else {  //Si no lo teniamos... añadimos un nuevo usuario con su libro..
                    newUsuario.prestamos?.push(libro)
                    usuariosPrestamos.push(newUsuario)
                }
            }
            return usuariosPrestamos;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
