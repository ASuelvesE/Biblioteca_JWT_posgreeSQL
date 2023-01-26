import Libro from "./Libro"
import Prestamo from "./Prestamo"


export default interface Usuario{
    alias: String
    password?: String
    token?: String
    prestamos?: Libro[]
}