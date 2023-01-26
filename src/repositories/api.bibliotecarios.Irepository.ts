import Bibliotecario from "../models/Bibliotecario";



export default interface IApiBibliotecariosRepository{
    create(bibliotecario: Bibliotecario) : Promise<Boolean>;
    login(bibliotecario: Bibliotecario) : Promise<Bibliotecario>;
}