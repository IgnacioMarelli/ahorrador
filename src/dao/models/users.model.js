import mongoose from 'mongoose';

export const userCollection = 'usuarios';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  documents:{
    type:[
      {
      name:{type:String},
      reference:{type:String}
      }
    ], default:[]
  },
  date:{type:Date},
  objetivoDiario:{
    type:Number,
    default: 0
  },
  disponible:{
    type:Number
  },
  tiempo:{
      type:Number,
      default: 0
  },
  objetivo:{
      type:Number,
      default: 0
  },
  salario:{
      type:Number,
      default: 0  
  },
  plazoFijoBanco:{
      type: [
          {
              deposito: {type: mongoose.Schema.Types.ObjectId, ref: 'deposito'}
          }
      ], default: []
  },
  plazoFijoMP:{
      type: [
          {
            deposito: {type: mongoose.Schema.Types.ObjectId, ref: 'deposito'}
          }
      ], default: []
  }  
});


export const userModel = mongoose.model(userCollection, userSchema);