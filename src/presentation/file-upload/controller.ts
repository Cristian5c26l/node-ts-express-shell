import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";



export class FileUploadController {
  
  // DI 
  constructor(
    private readonly fileUploadService: FileUploadService
  ) {}

  private handleError = (error: unknown, res: Response) => {

    if ( error instanceof CustomError ) {
      
      return res.status(error.statusCode).json({error: error.message});

    }

    // Este log si se imprime es grave
    console.log(`${ error }`);
    return res.status(500).json({error: 'Internal server error'});
  }


  uploadFile = (req: Request, res: Response) => {// express recomienda que los controladores para cada ruta no sean async-await (async(req:Request))
    
    const type = req.params.type;
    
    //console.log({ files: req.files })

    // const file = req.files.file;
    // En este punto, file puede ser de tipo UploadedFile o de tipo UploadedFile[]. Esto lo corregiremos con un middleware

    const file = req.body.files.at(0) as UploadedFile;

    //console.log({body: req.body});
    

    this.fileUploadService.uploadSingle( file, `uploads/${ type }` )
      .then(uploaded => res.json(uploaded))
      .catch(error => this.handleError(error, res));


  }// 400 es bad request, 201 es que se ha añadido exitosamente la categoría

  uploadMultipleFiles = (req: Request, res: Response) => {
  
    const type = req.params.type;
    
    const files = req.body.files as UploadedFile[];

    this.fileUploadService.uploadMultiple( files, `uploads/${ type }` )
      .then(uploaded => res.json(uploaded))
      .catch(error => this.handleError(error, res));


  }


}
