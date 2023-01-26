import { NextFunction, Request, Response } from "express";
import { hash, compare } from "../security/encrypter";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import executeQuery from "../db/posgres/posgres.connector";
import Usuario from "../models/Usuario";

const SECRET_KEY: Secret = "mySecretKey";

const createToken = (user: Usuario): string => {
  const payload = {
    user: {
      alias: user.alias,
      password: user.password,
    },
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];
    if (token) {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      //console.log(decoded);

      req.body.auth = decoded.user;
      next();
    } else response.status(401).json("No autorizado");

  } catch (err) {
    //console.error(err);
    response.status(401).json(err);
  }
};

const isBibliotecario = async (req: Request, response: Response, next: NextFunction) => {

  try {
    const userAutenticated = req.body.auth;

    const sql = `select * from bibliotecarios where alias = '${userAutenticated.alias}'`
    const bibliotecarioDB: any[] = await executeQuery(sql);

    if (bibliotecarioDB.length) {
      if (compare(userAutenticated.password, bibliotecarioDB[0].password))
        next();
      else response.status(401).json();
    }
    else response.status(401).json("No autorizado");

  } catch (err) {
    //console.error(err);
    response.status(401).json(err);
  }
}

export { createToken, isAuth, isBibliotecario };