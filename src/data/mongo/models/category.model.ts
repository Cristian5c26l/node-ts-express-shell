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


export const CategoryModel = mongoose.model('Category', categorySchema);// Coleccion Category (categorys)
