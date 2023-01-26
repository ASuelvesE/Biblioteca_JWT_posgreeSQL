
import executeQuery from '../db/posgres/posgres.connector'
import Bibliotecario from '../models/Bibliotecario';
import Libro from '../models/Libro';
import Prestamo from '../models/Prestamo';
import Usuario from '../models/Usuario';
import IApiLibrosRepository from './api.libros.Irepository';


export default class ApiLibrosRepositoryMySQL implements IApiLibrosRepository {
    async devuelveLibro(codigo: Number, usuarioAutorizado: Usuario): Promise<Boolean> {
        const sql: string = `update prestamos set fin = to_timestamp(${Date.now()} / 1000.0),fin_bibliotecario = '${usuarioAutorizado.alias}' where libro = ${codigo}`
        try {
            const sql2: string = `select * from prestamos where libro = ${codigo}`
            const prestamo: any = await executeQuery(sql2);
            if (prestamo.length) {
                await executeQuery(sql);
                return true;
            } else return false;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async findAll(): Promise<Libro[]> {
        const sql: string = `select * FROM libros`
        try {
            const libros: Libro[] = await executeQuery(sql)
            return libros;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async findAllPrestamos(): Promise<Libro[]> {
        const libros: Libro[] = [];
        const sql: string = `select l.*,p.*
        from libros l
        join prestamos p on p.libro = l.codigo`
        try {
            const librosDB: any[] = await executeQuery(sql)
            for (let libroDB of librosDB) {
                const newLibro: Libro = {
                    codigo: libroDB.codigo,
                    titulo: libroDB.titulo,
                    prestamos: []
                }
                const prestamo: Prestamo = {
                    usuario: libroDB.usuario,
                    inicio: libroDB.inicio,
                    fin: libroDB.fin,
                    inicio_bibliotecario: libroDB.inicio_bibliotecario,
                    fin_bibliotecario: libroDB.fin_bibliotecario
                }
                const libroPrestamo: Libro | undefined = libros.find((libro) => { //Si sale undefined no lo teniamos en el array
                    return libro.codigo === libroDB.codigo
                });

                if (libroPrestamo) { //Si ya lo teniamos... entonces solo le añadimos el libro
                    libroPrestamo.prestamos?.push(prestamo)
                } else {  //Si no lo teniamos... añadimos un nuevo usuario con su libro..
                    newLibro.prestamos?.push(prestamo)
                    libros.push(newLibro)
                }
            }
            return libros;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async findAllPrestamosByLibro(codigo: Number): Promise<Libro> {
        const newLibro: Libro = {
            codigo: codigo,
            titulo: "",
            prestamos: []
        }
        const sql: string = `select l.*,p.*
        from libros l
        join prestamos p on p.libro = l.codigo
        where l.codigo = ${codigo}`
        try {
            const librosDB: any[] = await executeQuery(sql)
            for (let libroDB of librosDB) {
                newLibro.titulo = libroDB.titulo;
                const prestamo: Prestamo = {
                    usuario: libroDB.usuario,
                    inicio: libroDB.inicio,
                    fin: libroDB.fin,
                    inicio_bibliotecario: libroDB.inicio_bibliotecario,
                    fin_bibliotecario: libroDB.fin_bibliotecario
                }
                newLibro.prestamos?.push(prestamo)
            }
            return newLibro;
        } catch (error) {
            console.error(error);
            return newLibro;
        }
    }
}
