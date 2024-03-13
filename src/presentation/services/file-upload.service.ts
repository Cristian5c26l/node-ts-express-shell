import path from "path";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";



export class FileUploadService {
  
  // Ocupamos del constructor en caso de que se le inyecten dependencias a FileUploadService
  constructor(
    private readonly uuid = Uuid.v4,
  ) {}

  private checkFolder( folderPath: string ) {
  
  if ( !fs.existsSync(folderPath) ) {
      fs.mkdirSync(folderPath);
    }

  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'gif', 'jpg', 'jpeg'],
  ) {
    
    try {
      const fileExtension = file.mimetype.split('/').at(1) ?? '';

      if ( !validExtensions.includes( fileExtension ) ) {
        throw CustomError.badRequest(`Invalid extension: ${ fileExtension }, valid ones: ${ validExtensions }`);
      }

      const destination = path.resolve( __dirname, '../../../', folder );// __dirname contiene la ruta absoluta de este archivo file-upload.service.ts. Sin embargo, nos ubicamos tres directorios atras para reducir dicha ruta absoluta para despues agregarle el nombre del folder a dicha ruta reducida. (destination = /media/cristian/Almacenamiento/cursos/devtalles/linux/Node-JS-De-Cero-a-Experto/Node/08-user-store/uploads). Directorio uploads deberá ser creado previamente

      this.checkFolder(destination);

      //file.mv(destination + `/mi-imagen.${ fileExtension }`);// mv es un metodo del file (archivo subido) para colocar dicho file en una ruta especifica. En este caso, el archivo se guardará en la ruta destination + `/mi-imagen.${ fileExtension }`

      const fileName = `${this.uuid()}.${fileExtension}`;

      file.mv(`${destination}/${fileName}`);

      return { fileName };


    } catch(error) { // Capturamos por ejemplo el CustomError
      //console.log({error});
      throw error;// Lanzamos el error (CustomError) al catch de esta promesa uploadSingle
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
  ) {
    
    // Ejecutando todas las promesas de manera simultanea y esperando que todas terminen
    // map hace que se genere un array de promesas this.uploadSingle(file, folder, validExtensions) (file será cada file de giles) las cuales se ejecutaran desde el mismo array. Al final, se tiene: [this.uploadSingle(file1, folder, validExtensions), this.uploadSingle(file2, folder, validExtensions), ... , this.uploadSingle(fileN, folder, validExtensions)]
    const fileNames = await Promise.all(
      files.map(file => this.uploadSingle(file, folder, validExtensions))
    );


    return fileNames;

  }

}
