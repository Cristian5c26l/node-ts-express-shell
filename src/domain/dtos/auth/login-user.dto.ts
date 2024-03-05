
import { regularExps } from "../../../config";

export class LoginUserDto {

  // Propiedades necesarias ya "limpias" para poder utilizarlas para "buscar" en la base de datos con el fin de logearse. 
  private constructor(
    public email: string,
    public password: string,
  ){}

  // Validaciones del body de la request. Para el tema del logeo, solo debemos verificar que en el body venga el email y el password
  static create(object: {[key:string]: any}): [string?, LoginUserDto?] {// object generalmente será req.body
    
    const { email, password } = object;
    
    if ( !email ) return ['Missing email'];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid'];
    if ( !password ) return ['Missing password'];
    if ( password.length < 6 ) return ['Password too short'];

    return [undefined, new LoginUserDto(email, password)];
  }

}
