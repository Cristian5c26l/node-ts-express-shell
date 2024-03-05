import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";





export class AuthController {

  // DI 
  constructor(
    public readonly authService: AuthService
  ) {}

  private handleError = (error: unknown, res: Response) => {

    if ( error instanceof CustomError ) {
      
      return res.status(error.statusCode).json({error: error.message});

    }

    // Este log si se imprime es grave
    console.log(`${ error }`);
    return res.status(500).json({error: 'Internal server error'});
  }

  registerUser = (req: Request, res: Response) => {

    const [error, registerDto] = RegisterUserDto.create(req.body);

    if ( error ) return res.status(400).json({error});

    this.authService.registerUser(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));

  }


  // Recordar que los controladores (los metodos que tienen req y res de express) de express no deben ser asincronos. Esta es una buena practica 
  loginUser = (req: Request, res: Response) => {

    const [error, loginDto] = LoginUserDto.create(req.body);

    if ( error ) return res.status(400).json({error});// 400 es bad request 


    this.authService.loginUser(loginDto!)
      .then(user => res.json(user))
      .catch((error) => this.handleError(error, res));


  }

  validateEmail = (req: Request, res: Response) => {

    res.json('validateEmail');
  }


}
