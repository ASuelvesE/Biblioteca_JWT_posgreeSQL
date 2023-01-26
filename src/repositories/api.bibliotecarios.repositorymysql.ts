

import executeQuery from '../db/posgres/posgres.connector'
import { hash, compare } from "../security/encrypter";
import { createToken, isAuth } from "../security/auth";
import Bibliotecario from '../models/Bibliotecario';
import Libro from '../models/Libro';
import IApiBibliotecariosRepository from './api.bibliotecarios.Irepository';
import IApiLibrosRepository from './api.libros.Irepository';


export default class ApiBibliotecariosRepositoryMySQL implements IApiBibliotecariosRepository {
    async create(bibliotecario: Bibliotecario): Promise<Boolean> {
        try {
            if(bibliotecario.user.password){
                const sql: string = `insert into bibliotecarios values('${bibliotecario.user.alias}','${hash(bibliotecario.user.password)}')`;
                await executeQuery(sql);
                return true;
            }
            return false
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async login(bibliotecario: Bibliotecario): Promise<Bibliotecario> {
        try {
            if(bibliotecario.user.password){
                const sql: string = `select * from bibliotecarios where alias = '${bibliotecario.user.alias}'`;
                const bibliotecarioDB: any[] = await executeQuery(sql);
                if (bibliotecarioDB) {
                    if (compare(bibliotecario.user.password, bibliotecarioDB[0].password)) {
                        bibliotecario.token = createToken(bibliotecario.user);
                    }
                }
            }
            return bibliotecario;
        } catch (error) {
            console.error(error);
            return bibliotecario;
        }
    }


}
