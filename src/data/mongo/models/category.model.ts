import mongoose, { Schema } from "mongoose";


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true, // Esto asegura que no hayan por ejemplo 2 categorias llamadas "Hot Chocolate"
  }, 

  available: {
    type: Boolean,
    default: false
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }


});

categorySchema.set('toJSON', {
  virtuals: true,// agregar id cuando se traiga un modelo category de mongoose 
  versionKey: false, // quitar __v cuando se traiga un modelo category de mongoose
  transform: function(doc, ret, options) {
    delete ret._id// ocultar _id cuando se traiga un modelo category de mongoose
  },
});

export const CategoryModel = mongoose.model('Category', categorySchema);// Coleccion Category (categorys)
