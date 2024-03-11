

import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { ProductService } from '../services/product.service';




export class ProductRoutes {


  static get routes(): Router {

    const router = Router();

    const productService = new ProductService();
    const controller = new ProductController( productService );
    
    // Definir las rutas

    // GET a /api/products (obtener productos). GET para obtener
    router.get('/', controller.getProducts);

    // POST a /api/products (crear producto). POST para crear
    router.post('/', [ AuthMiddleware.validateJWT ] ,controller.createProduct);

    

    return router;
  }


}

