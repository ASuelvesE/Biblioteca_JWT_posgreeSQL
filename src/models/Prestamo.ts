import Libro from "./Libro"
import Usuario from "./Usuario"

export default interface Prestamo{

    codigo?: String
    titulo?: String
    inicio: Date
    fin: Date
    inicio_bibliotecario?: String
    fin_bibliotecario?: String
    usuario?: Usuario
}