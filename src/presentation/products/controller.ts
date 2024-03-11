
import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services/product.service";



export class ProductController {
  
  // DI 
  constructor(
    private readonly productService: ProductService
  ) {}

  private handleError = (error: unknown, res: Response) => {

    if ( error instanceof CustomError ) {
      
      return res.status(error.statusCode).json({error: error.message});

    }

    // Este log si se imprime es grave
    console.log(`${ error }`);
    return res.status(500).json({error: 'Internal server error'});
  }


  createProduct = (req: Request, res: Response) => {// express recomienda que los controladores para cada ruta no sean async-await (async(req:Request))
    
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,// body originalmente puede ser {name: 'algo', category: 'idValido de la categoria'}
      user: req.body.user.id
    });// Si el middleware AuthMiddleware nos deja pasar, req.body.user contiene una instancia de UserEntity donde dicha instancia contiene el id del usuario que quiere crear el nuevo producto (el id del usuario se extrae de un token que se le da al hacer login donde en dicho token viene su id) 
    if ( error ) return res.status(400).json({error});
    
    // En este punto, req.body ya tendrá la propiedad user, la cual se le agregó desde middleware AuthMiddleware.validateJWT
    
    this.productService.createProduct(createProductDto!)
      .then(product => res.status(201).json(product))
      .catch(error => this.handleError(error, res));// Por ejemplo, throw CustomError arroja instancia de CustomError a catch, donde el nombre de esta instancia será error



  }// 400 es bad request, 201 es que se ha añadido exitosamente la categoría

  getProducts = (req: Request, res: Response) => {
  
    const { page = 1, limit = 10 } = req.query;// req.query es igual a { page: "3", limit: "5" } si la ruta es /api/categories?page=3&limit=10. En caso de que page no venga, se le asigna el valor 1

    const [error, paginationDto] = PaginationDto.create(+page, +limit);// como page será string si si viene en la ruta, con + lo intento convertir a numero ese numero que esta en el string (en caso de no poder lograr la conversion, no arrojará error)
    if ( error ) return res.status(400).json({error});// 400 es bad request

    this.productService.getProducts(paginationDto!)
      .then(products => res.json(products))
      .catch(error => this.handleError(error, res));// Por ejemplo, throw CustomError arroja instancia de CustomError a catch, donde el nombre de esta instancia será error

  }


}
