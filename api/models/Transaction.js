const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
    name: {type:String, required:true},
    price:{type:Number, required:true},
    description: {type:String, required:true},
    datetime: {type:Date, required:true}
})

TransactionSchema.post('save', function(error, doc, next) {
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const key in error.errors) {
        validationErrors[key] = error.errors[key].message;
      }
      return next(new Error(JSON.stringify(validationErrors)));
    }
    next(error);
  });

const TransactionModel = model('Transaction', TransactionSchema);

module.exports = TransactionModel;