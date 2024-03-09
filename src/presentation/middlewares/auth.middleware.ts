import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";



export class AuthMiddleware {

  static async validateJWT( req: Request, res: Response, next: NextFunction ) {

    const authorization = req.header('Authorization');// Recuperar el valor del header llamado Authorization enviado en la peticion o quest (req)
    
    if( !authorization ) return res.status(401).json({error: 'No token provided'});
    if( !authorization.startsWith('Bearer ') ) return res.status(401).json({error: 'Invalid Bearer token'});

    // authorization.split(' ')[1] es lo mismo que authorization.split(' ').at(1) (at es la sintaxis nueva de javascript para los arreglos)
    const token = authorization.split(' ')[1] || '';

    try {

      const payload = await JwtAdapter.validateToken<{id: string}>(token);// Use un generico (<T>) para eviar usar validateToken(token) as {id: string} 
      // en este punto, payload puede ser null o un objeto que tenga una propiedad llamada id de tipo string (este payload debe haberse establecido al token cuando se creó)

      if ( !payload ) return res.status(401).json({error: 'Invalid token'});// si payload es null, quiere decir que el token ha sido alterado o no coincide la semilla con el payload los cuales se le establecieron al token al crearlo
      
      
      // Tras haber extraido el payload (que tiene el id del usuario) del token el cual es dado al usuario cuando hace el login, buscar que dicho usuario con id esté en la base de datos mystore en la coleccion users (UserModel) 
      const user = await UserModel.findById(payload.id);
      if ( !user ) return res.status(401).json({error: 'Invalid token - user'}); // 401 es unauthorized.

      // TODO: Validar si el usuario está activo

      // Colocar en objeto body la propiedad user que contenga un objeto con la información del usuario
      req.body.user = UserEntity.fromObject(user);

      
      // Si llegamos a este punto, el token fue validado (el token fue creado con un payload y semilla especifica y el token aun no expira) y el id del usuario que contiene dicho token existe en la base de datos mongo... 
      // ...por lo tanto, hay que proceder con el siguiente middleware o con el siguiente controlador de ruta (dependiendo lo que esté primero). Esto se hace con la función next 
      next();
      
      
    } catch (error) { // en catch se capturará un error el cual será un error no controlado por el usuario que dispara la peticion 
      
      console.log(error);
      res.status(500).json({error: 'Internal server error'});// Codigo 500 es de error interno del servidor (este es un error que no se espera)
      
      
    }


  }


}
