
import mongoose, { Schema } from "mongoose";


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true, // para no tener dos productos con el mismo nombre
  }, 

  available: {
    type: Boolean,
    default: false
  },

  price: {
    type: Number,
    default: 0
  },

  description: {
    type: String,
    // Si no hay un default o valor por defecto aqui, la propiedad description no existirá en el documento que se agregue a la coleccion products
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',// Relacion con la coleccion users
    required: true
  }, 

  category: {// Relacion con la coleccion categorys
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true// Cada producto tendrá que tener una categoria obligatoria. Dicha categoria estará registrada en la coleccion categories (Category)
  }


});

// NOTA: Esto solo funciona con const product = new ProductModel({name: '', ....}) y await product.save(). No funciona con ProductModel.insertMany 
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret, options) {
    delete ret._id;
  },
});

export const ProductModel = mongoose.model('Product', productSchema);// Coleccion product (products)
