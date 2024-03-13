import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {
    

    //* Middlewares que se aplican a todas las rutas incluidas en esta aplicacion. Estas rutas son /, this.routes y todas las demas (*)
    this.app.use( express.json() ); // body tipo raw
    this.app.use( express.urlencoded({ extended: true }) ); // body tipo x-www-form-urlencoded
    this.app.use(fileUpload({// agrega file a los archivos (files) de la peticion (req) (req.files.file) manejada por cada controlador para dicha peticion. file de req.files.file será un objeto de tipo UploadedFile o será de tipo UploadedFile[] (un array de objetos UploadedFile) en caso de que se envien en el body de la peticion 2 o mas archivos
      limits: { fileSize: 50 * 1024 * 1024 },
    }));// middleware fileUpload esta destinado a que funcione si el body es de tipo multipart/form-data

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use( this.routes );

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}
