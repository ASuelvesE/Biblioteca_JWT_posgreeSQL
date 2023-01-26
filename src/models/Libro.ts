import Prestamo from "./Prestamo"


export default interface Libro{

    codigo: Number
    titulo: String
    prestamos? : Prestamo[]
}