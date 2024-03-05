import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";




export class AuthService {

  // DI
  constructor() {}

  public async registerUser( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if ( existUser ) throw CustomError.badRequest('Email already exist');// badRequest es codigo 400

    try {
      
      const user = new UserModel(registerUserDto);// Creamos un documento para la colceccion o tabla User


      // Encriptar la contraseña 

      user.password = bcryptAdapter.hash( registerUserDto.password );

      await user.save();// Guardamos en la colceccion User el documento user

      // JWT <------- para mantener la autenticación del usuario
      
      // Email de confirmación
      

      const { password, ...rest } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({id: user.id});
      if (!token) throw CustomError.internalServer('Error while creating JWT');


      return {
        user: rest,
        token: token
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }


  }

  public async loginUser( loginUserDto: LoginUserDto ) {


    // Verificar si el email existe para ese usuario
    const user = await UserModel.findOne({email: loginUserDto.email});
    if (!user) throw CustomError.badRequest('Email not exist');// Si no existe, arrojar un notFound
      
    // En caso de que existe usuario con loginUserDto.email...
    // Verificar si la contraseña que viene para autenticarse (loginUserDto.password) corresponde a dicho usuario con email.(user. que tiene el password hasheado (user.password)
    const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
    if ( !isMatching ) throw CustomError.badRequest('Password is not valid');// unauthorized es 401 

    // En este punto, el password de login (loginUserDto.password) del usuario con email (loginUserDto.email) si es valida

    // Respondiendo con los datos del usuario
    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token
    }
  }

}
