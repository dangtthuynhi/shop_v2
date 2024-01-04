const express = require('express');
const router = express.Router();

const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Category = require("../../models/category");

router.get('/add-to-cart', async function (req, res) {
  try {
    const { productCode, sizePrice, qty } = req.query;

    // Find the product and sizePrice
    const product = await Product.findOne({ productCode: productCode }).populate("category");


    if (!product) {
      console.error("Product not found");
      return res.redirect('/');
    }

    const selectedSizePrice = product.sizePrices.find(sp => sp._id == sizePrice);

    if (!selectedSizePrice) {
      console.error("Error finding sizePrice:", sizePrice);
      return res.redirect('/');
    }

    // Create or update the cart
    const cart = new Cart(req.session.cart);
    cart.add(product, selectedSizePrice, parseInt(qty));
    req.session.cart = cart;

    // Render the cart page with updated data
    const reloadScript = `<script>window.location.href = '/products/${product.category.slug}/${product.productCode}';</script>`;
    res.send(reloadScript);

  } catch (err) {
    console.error("Error adding to cart:", err);
    return res.redirect('/');
  }
});


router.get('/', async function (req, res) {
  try {
    const categories = await Category.find({});
    const cart = new Cart(req.session.cart);
    const cartItemsArray = cart.generateArray();
    console.log(cart);

    console.log(cartItemsArray);
    return res.render("user/cart", {
      pageName: "Giỏ hàng",
      cartItemsArray,
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
      categories
    });
  } catch (err) {
    console.error("Error rendering cart page:", err);
    return res.redirect('/');
  }
});

router.post('/update-cart', async function (req, res) {
  const updates = req.body.cart;
  const cart = new Cart(req.session.cart);

  // Update the cart with the provided changes
  cart.updateCart(updates);
  req.session.cart = cart;

  // Send a response indicating success
  res.json({ success: true });
});

module.exports = router;