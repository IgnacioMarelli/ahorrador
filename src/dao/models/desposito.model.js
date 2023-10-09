import mongoose from 'mongoose';

export const depositoCollection = 'deposito';

const depositoSchema = new mongoose.Schema({
  date:{type:Date},
  pesos:{type: Number, default: 0},
  porcentaje:{type:Number, default: 118}
})

export const depositoModel = mongoose.model(depositoCollection, depositoSchema);