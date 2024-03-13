import fs from 'fs';
import path from 'path';

import { Request, Response } from "express";




export class ImageController {

  // constructor destinado a la inyeccion de dependencias
  constructor() {}

  getImage = (req: Request, res: Response) => {
    
    // Obtener parámetros de ruta
    const { type = '', img = '' } = req.params;
    
    // Formar ruta absoluta partiendo de la ruta absoluta actual (__dirname)
    const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);

    if ( !fs.existsSync( imagePath ) ) {
      return res.status(404).send('Image not found');
    }

    res.sendFile( imagePath );

  }

}
