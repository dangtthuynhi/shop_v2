const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
const orderSchema = Schema({
  cart: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
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

autoIncrement.initialize(mongoose.connection);

orderSchema.plugin(autoIncrement.plugin, 'Order');

module.exports = mongoose.model("Order", orderSchema);

