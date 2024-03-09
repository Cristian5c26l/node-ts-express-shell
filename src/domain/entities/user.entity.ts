import { CustomError } from '../index';


export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public validatedEmail: boolean,
    public password: string,
    public role: string[],
    public img?: string,// Todo lo opcional va hasta el ultimo. Si img es opcional, entonces puede ser undefined (img es igual a undefined)
  ) {}

  static fromObject( object: { [key:string]: any } ) {
    
    const { id, _id, name, email, validatedEmail, password, role, img } = object;

    if ( !_id && !id ) {// Si _id y id son undefined
      
      throw CustomError.badRequest('Missing id');

    }

    if ( !name ) throw CustomError.badRequest('Missing name');
    if ( !email ) throw CustomError.badRequest('Missing email');
    if ( validatedEmail === undefined ) throw CustomError.badRequest('Missing validatedEmail');
    if ( !password ) throw CustomError.badRequest('Missing password');
    if ( !role ) throw CustomError.badRequest('Missing role');


    return new UserEntity( id || _id, name, email, validatedEmail, password, role, img);



  }
}
