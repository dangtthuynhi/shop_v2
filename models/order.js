const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

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

// Pre-save hook to handle auto-incrementing and formatting
orderSchema.pre('save', async function (next) {
  try {
    const Order = mongoose.model("Order"); // Reference the Order model here
    if (!this.orderNumber) {
      const lastOrder = await Order.findOne({}, {}, { sort: { 'createdAt': -1 } });
      const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber.slice(2), 10) : 0;
      const nextOrderNumber = lastOrderNumber + 1;
      this.orderNumber = `DH${String(nextOrderNumber).padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Order", orderSchema);

