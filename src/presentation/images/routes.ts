import { Router } from "express";
import { ImageController } from "./controller";





export class ImageRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new ImageController();

    // Definir las rutas 
    // GET a ruta /api/images/directorio/img
    router.get('/:type/:img', controller.getImage);// type y img serán parámetros (params) de la peticion (req) a ruta /api/images/:types/:img


    return router;

  } 

}
