import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";




export class AuthService {

  // DI
  constructor(
    private readonly emailService: EmailService
  ) {}

  public async registerUser( registerUserDto: RegisterUserDto ) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });// En este punto, registerUserDto es una instancia con email y password validados
    if ( existUser ) throw CustomError.badRequest('Email already exist');// badRequest es codigo 400

    try {
      
      const user = new UserModel(registerUserDto);// Creamos un documento para la colceccion o tabla User


      // Encriptar la contraseña 

      user.password = bcryptAdapter.hash( registerUserDto.password );

      await user.save();// Guardamos en la colceccion User el documento user

      
      // Email de confirmación

      await this.sendEmailValidationLink(user.email);
      

      const { password, ...rest } = UserEntity.fromObject(user);

      // JWT <------- para mantener la autenticación del usuario

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

    const token = await JwtAdapter.generateToken({id: user.id});
    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token
    }
  }

  private sendEmailValidationLink = async( email: string ) => {// Este envio de correo electronico puede ser un caso de uso en caso de que este trabajando en la arquitectura limpia

    // Generar nuevo token (o podria generar algun valor de la base de datos como un uuid) con payload que tenga el email ({email}) del usuario registrado en registerUser
    const token = await JwtAdapter.generateToken({email});
    if (!token) throw CustomError.internalServer('Error getting token');// internalServer significa error interno de la aplicacion. QUiza una funcion como la de generateToken no pudo internamente generar un token 

    // Generar link de retorno el cual será clickeado por el nuevo usuario registrado con registerUser con determinado email
    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    
    // Generar el contenido del email (el contenido será HTML)
    const html = `
      <h1>Validate your email</h1>
      <p>We have sent you this email with the following link to validate your email ${email}</p>
      <a href="${link}">Click here to validate your email</a>
    
    `;

    // Mandar el contenido html al usuario nuevo que se está registrando con email especifico
    
    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;

  }

  public validateEmail = async(token: string) => {
    
    // Verificando si token fue firmado con mi servidor (la semilla de mi servidor)

    const payload = await JwtAdapter.validateToken(token);
    
    // Si payload es null, significa que el token no es valido, por lo cual, genera un error de tipo unauthorized
    if ( !payload ) throw CustomError.unauthorized('Invalid token');
    
    const { email } = payload as { email: string }// payload en realidad es de tipo any, pero, con as, digo que payload lucirá como un objeto con una propiedad llamada email de tipo string.
    
    // Si email es null, significa que no incluimos en la creacion o generacion del token un payload que consista de un objeto que incluya el email de la persona que estará verificando su email 
    if ( !email ) throw CustomError.internalServer('Email not in token');
    
    // Despues de validar que token haya sido firmado por mi servidor...
    
    const user = await UserModel.findOne({email});
    
    if ( !user ) throw CustomError.internalServer('Email not exist'); //internal server porque en la base de datos no se estaría encontrando el usuario con determinado email cuando deberia ser asi porque este metodo validateEmail solo se dispara cuando la persona hizo click en el enlace a /api/auth/validate-email/:token


    user.validatedEmail = true;
    
    await user.save();// Impactar en la base de datos el cambio realizado a user.

    return true;

  }

}
