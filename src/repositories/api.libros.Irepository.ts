import Bibliotecario from "../models/Bibliotecario";
import Libro from "../models/Libro";
import Usuario from "../models/Usuario";


export default interface IApiLibrosRepository{
    findAll() : Promise<Libro[]>;
    findAllPrestamos() : Promise<Libro[]>;
    findAllPrestamosByLibro(codigo: Number) : Promise<Libro>;
    devuelveLibro(codigo: Number, usuarioAutorizado: Usuario) : Promise<Boolean>;
}