import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const plazoFijoCollection = 'deposito';

const plazoFijoSchema = new mongoose.Schema({
  date:{type:Date},
  pesos:{type: Number, default: 0},
  porcentaje:{type:Number, default: 118}
})

plazoFijoSchema.plugin(mongoosePaginate)
export const plazoFijoModel = mongoose.model(plazoFijoCollection, plazoFijoSchema);