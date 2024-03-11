import mongoose from "mongoose";



const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },

  email: {
    type: String,
    required: [ true, 'Email is required' ],
    unique: true
  },

  password: {
    type: String,
    required: [true, 'Password is required']
  },

  validatedEmail: {
    type: Boolean,
    default: false
  },

  img: {// img hace referencia a la foto de perfil del usuario
    type: String,
  },

  role: {// Un usuario puede tener diferentes roles (administrador, gestor, etc). role es de tipo array de strings
    type: [String],
    default: ['USER_ROLE'],
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  }

});

userSchema.set('toJSON', {
  virtuals: true,// agregar id cuando se traiga un modelo user de mongoose 
  versionKey: false, // quitar __v cuando se traiga un modelo user de mongoose
  transform: function(doc, ret, options) {
    delete ret._id// ocultar _id cuando se traiga un modelo user de mongoose
    delete ret.password// ocultar password cuando se traiga un modelo user de mongoose
  },
});

export const UserModel = mongoose.model('User', userSchema);
