import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  
  static async generateToken( payload: any, duration: string = '2h' ) {

    return new Promise((resolve) => {

      jwt.sign(payload, JWT_SEED, {expiresIn: duration}, (err, token) => {// Crear token que contenga un payload codificado. Este token estará firmado por la semilla JWT_SEED
        
        if ( err ) return resolve(null);

        resolve(token);


      }); 

    });

  }

  static validateToken<T>(token: string): Promise<T|null> {

    return new Promise((resolve) => {

      jwt.verify(token, JWT_SEED, (err, decoded) => {// Verificar si token está firmado o fue creado con la semilla JWT_SEED (y tambien se verifica si dicha semilla JWT_SEED es la firma del token junto con el payload)
        
        if (err) return resolve(null);

        resolve(decoded as T);// decoded es el payload decodificado (payload antes de ser codificado para que fuera parte del token)

      });

    });
  }

}
