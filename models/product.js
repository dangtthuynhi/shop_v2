const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sizePriceSchema = new Schema({
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const productSchema = Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  sizePrices: {
    type: [sizePriceSchema],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  available: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Product", productSchema);
