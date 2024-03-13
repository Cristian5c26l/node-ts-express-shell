import { NextFunction, Request, Response } from "express";


export class TypeMiddleware {

  static validTypes( validTypes: string[] ) {// Factory function "validTypes" que retorna una funcion o middleware

    return (req: Request, res: Response, next: NextFunction) => {
      // const type = req.params.type;
      const type = req.url.split('/').at(2) ?? '';// req.url contiene "/single/directorio" o "/multiple/directorio"
      if ( !validTypes.includes(type) ) {
        return res.status(400)
          .json({ error: `Invalid type: ${ type }, valid ones ${ validTypes }` });
      }

      next();// En caso de ejecutarse next(), entonces, se continuaría a la ejecucion del controlador de la ruta a la que se le antepone la ejecucion del middleware retornado por validTypes
    }

  }

}
