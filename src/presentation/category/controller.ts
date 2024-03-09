import { Request, Response } from "express";
import { CreateCategoryDTO, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";



export class CategoryController {
  
  // DI 
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  private handleError = (error: unknown, res: Response) => {

    if ( error instanceof CustomError ) {
      
      return res.status(error.statusCode).json({error: error.message});

    }

    // Este log si se imprime es grave
    console.log(`${ error }`);
    return res.status(500).json({error: 'Internal server error'});
  }


  createCategory = (req: Request, res: Response) => {// express recomienda que los controladores para cada ruta no sean async-await (async(req:Request))
    
    const [error, createCategoryDto] = CreateCategoryDTO.create(req.body);
    if ( error ) return res.status(400).json({error});
    
    // En este punto, req.body ya tendrá la propiedad user, la cual se le agregó desde middleware AuthMiddleware.validateJWT

    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then(category => res.status(201).json(category))
      .catch(error => this.handleError(error, res));// Por ejemplo, throw CustomError arroja instancia de CustomError a catch, donde el nombre de esta instancia será error

  }// 400 es bad request, 201 es que se ha añadido exitosamente la categoría

  getCategories = (req: Request, res: Response) => {
  
    const { page = 1, limit = 10 } = req.query;// req.query es igual a { page: "3", limit: "5" } si la ruta es /api/categories?page=3&limit=10. En caso de que page no venga, se le asigna el valor 1

    const [error, paginationDto] = PaginationDto.create(+page, +limit);// como page será string si si viene en la ruta, con + lo intento convertir a numero ese numero que esta en el string (en caso de no poder lograr la conversion, no arrojará error)
    if ( error ) return res.status(400).json({error});// 400 es bad request


    this.categoryService.getCategories(paginationDto!)
      .then(categories => res.json(categories))
      .catch(error => this.handleError(error, res));// Por ejemplo, throw CustomError arroja instancia de CustomError a catch, donde el nombre de esta instancia será error

  }


}
