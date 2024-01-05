const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { autoIncrement } = require('mongoose-plugin-autoinc');

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  totalOrderPrice: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

orderSchema.plugin(autoIncrement, {
  model: 'Order',
  field: 'orderNumber',
  startAt: 1,  
  incrementBy: 1,  
  prefix: 'DH',  
  unique: true, 
  format: 'DH%04d'  // Định dạng số đặt hàng với %04d để đảm bảo luôn có 4 chữ số
});

module.exports = mongoose.model("Order", orderSchema);

