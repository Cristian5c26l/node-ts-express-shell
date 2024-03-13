import { NextFunction, Request, Response } from "express";



export class FileUploadMiddleware {

  static containFiles( req: Request, res: Response, next: NextFunction ) {

    // Si req.files es nulo o req.files no tiene objeto:
    if ( !req.files || Object.keys(req.files).length === 0 ) {
      return res.status(400).json({error: 'No files were selected'});
    }
    
    // Si no es un array req.files.file
    if ( !Array.isArray( req.files.file ) ) {
      req.body.files = [ req.files.file ]// req.files.file será una instancia UploadedFile si se manda en la peticion 1 archivo almacenado por el nombre "file" el cual se indica en la misma peticion que se haga desde postman por ejemplo (middleware fileUpload de server.ts agregará una instancia UploadedFile como propiedad a req.files (req.files ya existe por defecto) con nombre file)
    } else {
      req.body.files = req.files.file;// req.files.file será un array de instancias UploadedFile si se manda en la peticion 2 archivos o mas (middleware fileUpload de server.ts agregará un array de instancias UploadedFile como propiedad a req.files (req.files ya existe por defecto) con nombre file)

    }
    
    next();

  }

}
