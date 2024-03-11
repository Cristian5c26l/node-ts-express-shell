import { Validators } from "../../../config";



export class CreateProductDto {
  
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,// ID
    public readonly category: string,// ID
  ) {}

  static create( props: { [key:string]: any } ): [string?, CreateProductDto?] {// props es req.body

    const {
      name,
      available,
      price,
      description,
      user,
      category,
    } = props;
    
    // Segun el modelo de producto (ProductModel) de la base de datos, el nombre, el usuario y la categoria son requeridos (data/mongo/models/product.model.ts)
    if ( !name ) return ['Missing name'];

    if ( !user ) return ['Missing name'];
    if ( !Validators.isMongoID(user) ) return ['Invalid User ID'];

    if ( !category ) return ['Missing name'];
    if ( !Validators.isMongoID(category) ) return ['Invalid Category ID'];
    
    return [
      undefined,
      new CreateProductDto(
        name,
        !!available,// Si no viene available en req.body (object) se interpretará que el producto no esta disponible (available=false). Como available no viene, entonces será undefined y con !available se obtiene true (cumple que available sea undefined) y con !!available se convierte en false la disponibilidad (available) del producto
        price,
        description,
        user,
        category,
      )
    ];

    // El resto de metadata del producto puede o no venir. Si no viene, simplemente en el documento producto que se cree no vendrá dicho resto de metadata (description, price)

  }

}
