import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const ingresoCollection = 'ingreso';

const ingresoSchema = new mongoose.Schema({
  date:{type:Date},
  pesos:{type: Number, default: 0},
  razon:{type:String, default: ""},
  usuario:{type: String, required: true},
  ingreso:{
    type:Boolean,
    default: true
  }
})

ingresoSchema.plugin(mongoosePaginate)
export const ingresoModel = mongoose.model(ingresoCollection, ingresoSchema);