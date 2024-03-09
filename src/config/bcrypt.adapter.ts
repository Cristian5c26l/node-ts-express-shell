import { compareSync, genSaltSync, hashSync } from "bcryptjs"



export const bcryptAdapter = {
  
  hash: (password: string) => {
    const salt = genSaltSync();// Por defecto, genera 10 vueltas
    return hashSync(password, salt);
  },

  compare: (password: string, hashed: string) => compareSync(password, hashed),

}

// el metodo hash del objeto bcryptAdapter encripta el password mandado y bueno retorna el password encriptado
// el metodo compare regresa true cuando password es la version no hasheada o encriptada de hashed
