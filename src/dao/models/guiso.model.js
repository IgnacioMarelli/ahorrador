import mongoose from 'mongoose';

export const guisoCollection = 'guiso';

const guisoSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  depositos:{
      type: [
          {
              deposito: {type: mongoose.Schema.Types.ObjectId, ref: 'deposito'}
          }
      ], default: []
  },
  total:{type: Number, default: 0},
})
guisoSchema.pre('findOne', function() {
  this.populate('depositos.deposito');
})
guisoSchema.pre('find', function() {
  this.populate('depositos.deposito');
})

export const guisoModel = mongoose.model(guisoCollection, guisoSchema);