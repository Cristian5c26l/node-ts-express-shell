
import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services/category.service';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController( categoryService );
    
    // Definir las rutas

    // GET a /api/categories (obtener categorias). GET para obtener
    router.get('/', controller.getCategories);

    // POST a /api/categories (crear categoria). POST para crear
    // router.post('/', controller.createCategory);
    router.post('/', [ AuthMiddleware.validateJWT ] ,controller.createCategory);

    

    return router;
  }


}

