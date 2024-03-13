
import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const fileUploadService = new FileUploadService();
    const controller = new FileUploadController(fileUploadService);
    
    // Middleware aplicado a las rutas de abajo (/single/:type y /multiple/:type)
    router.use( FileUploadMiddleware.containFiles );// Recordar que puede ser un middleware o un array de middlewares [FileUploadMiddleware.containFiles]
    router.use( TypeMiddleware.validTypes(['users', 'products', 'categories']) );

    // Definir las rutas

    // GET a /api/upload/single/<user|category|product>/ 
    router.post('/single/:type', controller.uploadFile);// Recordar que se hacen peticiones POST para subir archivos o cargar data

    // POST a /api/upload/multiple/<user|category|product>/
    router.post('/multiple/:type', controller.uploadMultipleFiles);

    

    return router;
  }


}

