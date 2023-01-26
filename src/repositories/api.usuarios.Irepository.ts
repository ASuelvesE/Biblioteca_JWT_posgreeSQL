import Usuario from "../models/Usuario";
import Prestamo from "../models/Prestamo"
export default interface IApiUsuariosRepository{

    createUser(user: Usuario): Promise<Boolean>;
    loginUser(user: Usuario): Promise<Usuario>;
    getPrestamosByUser(user: Usuario): Promise<Prestamo[]>;
    getPrestamosAll(): Promise<Usuario[]>
}