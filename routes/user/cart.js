const express = require('express');
const router = express.Router();

const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Category = require("../../models/category");

router.get('/add-to-cart', async function (req, res) {
  const query = req.query;
  // console.log(query);

  try {
    const product = await Product.findById(query.productCode).exec();
    const categories = await Category.find({});

    if (!product) {
      console.error("Product not found");
      return res.redirect('/');
    }

    // console.log(product);

    const sizePrice = product.sizePrices.find(sp => sp._id == query.sizePrice);

    if (!sizePrice) {
      console.error("Error finding sizePrice:", query.sizePrice);
      return res.redirect('/');
    }

    // console.log(sizePrice);

    // Ensure req.session is defined
    console.log(req.session);
    req.session = req.session || {};

    // Ensure req.session.cart is defined
    req.session.cart = req.session.cart || {};

    console.log(req.session.cart);

    const cart = new Cart(req.session.cart);
    cart.add(product, sizePrice, parseInt(query.qty));
    req.session.cart = cart;

    console.log(req.session.cart);
    // console.log(req.session.cart.items);
    const cartItemsArray = cart.generateArray();
    console.log(cartItemsArray);
    res.render("user/cart", {
      pageName: "Giỏ hàng",
      cartItemsArray,
      categories
    });
  } catch (err) {
    console.error("Error finding product:", err);
    return res.redirect('/');
  }
});

router.get('/reduce/:id', function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/remove/:id', function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/', function (req, res) {
  if (!req.session.cart) {
    return res.render('user/cart', { products: null });
  }

  const cart = new Cart(req.session.cart);
  return res.render('user/cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

module.exports = router;