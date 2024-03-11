import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";



export class ProductService {
  
  // DI
  constructor() {}// constructor lo dejamos aqui por si se quiere cambiar la base de datos o cambiar la forma de trabajar como implementar el patrón repositorio

  async createProduct( createProductDto: CreateProductDto ) {// Ver data/mongo/models/category.model.ts para ver que metadata se necesita para crear una nueva categoria (user va a ser generado desde presentation/middlewares/auth.middleware.ts)
    
    // createCategoryDto contiene informacion del nombre de la categoria que se quiere agregar

    const productExists = await ProductModel.findOne({name: createProductDto.name});// buscar en la coleccion categorys si ya hay una categoria que exista con nombre createCategoryDto.name 
    if ( productExists ) throw CustomError.badRequest('Product already exists');
    
    
    // Siempre colocar try-catch cuando se necesita impactar a la base de datos
    try {
      
      const product = new ProductModel(createProductDto);

      await product.save();// Impactar la base de datos (agregar documento category a coleccion categorys)

      // Retornar exactamente el modelo de mongoose
      return product;

    } catch (error) {// (violacion del indice o algo por el estilo de la base de datos)
    
      throw CustomError.internalServer(`${error}`);// Este error no se debería mostrar al usuario o a quien consuma mi API
    
    }


  }

  async getProducts( paginationDto: PaginationDto ) {


    const { page, limit } = paginationDto;
    
    try {

      // const categories = await CategoryModel.find();// categories contiene objetos de mongoose (objetos que representan documentos de la coleccion categories)
      
      // Averiguando el numero de categorias que hay
      // const total = await CategoryModel.countDocuments();
      
      // En mongo, las paginas comienzan desde 0
      // const categories = await CategoryModel.find()
      //   //.skip( 1 * 10 ); // Saltarse los primeros 10 registros
      //   .skip( (page - 1) * limit )
      //   .limit( limit );// Obtener "limit" cantidad de registros

      // De manera simultanea, para que el segundo await de arriba se pueda ejecutar aunque el primer await no se haya terminado
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip( (page - 1) * limit )
          .limit( limit )
          // .populate('user')
          // .populate(['user', 'category'])
          .populate([
            'user',
            {
              path: 'category',
              populate: {path: 'user'}
            }
          ])
      ]);
      // Con la segunda promesa, obtengo una pagina o un conjunto de documentos donde el primer documento es el de la posicion "(page - 1) * limit" y el ultimo está en la posicion "[(page - 1) * limit] + [limit] - 1" (siempre y cuando el primer documento este en la posicion 0). Por ejemplo, si limit = 3 y page = 1, significaria que el primer documento está en la posicion 0 y el ultimo documento estará en la posicion 2 (document 0, documento 1 y documento 2)


      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?pages=${ page + 1 }&limit=${ limit }`,
        prev: (page - 1 > 0) ? `/api/products?pages=${ page - 1 }&limit=${ limit }`: null,

        products: products,
      }

    }catch(error) {
      throw CustomError.internalServer('Internal Server Error');// Este error no se debería mostrar al usuario o a quien consuma mi API
    }

  }

}



