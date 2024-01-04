var express = require('express');
var router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const Cart = require('../../models/cart');
const Order = require('../../models/order');
const User = require('../../models/user');

router.get("/", async (req, res) => {
  try {
    // Fetch categories and their associated products using aggregation
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products', localField: '_id',
          foreignField: 'category', as: 'products'
        },
      },
    ]);

    // Fetch latest 12 products, sorted by createdAt in descending order
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("category");

    // Create a new Cart instance based on the session's cart
    const cart = new Cart(req.session.cart);
    const cartItemsArray = cart.generateArray();

    // Render the user/index view with the retrieved data
    res.render("user/index", {
      pageName: "Trang chủ",
      categories,
      products,
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
      cartItemsArray
    });
  } catch (error) {
    // Log the error and redirect to the home page if an error occurs
    console.log(error);
    res.redirect("/");
  }
});


router.get('/checkout', async function (req, res) {
  try {
    const categories = await Category.find({});
    const cart = new Cart(req.session.cart);
    const cartItemsArray = cart.generateArray();
    return res.render("user/checkout", {
      pageName: "Thông tin thanh toán",
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


// Route để xử lý đơn hàng
router.post('/create-order', async (req, res) => {
  // Lấy dữ liệu từ req.body
  const { fullName, phoneNumber, address, email, note, paymentMethod } = req.body;
  const cart = new Cart(req.session.cart);
  const cartItemsArray = cart.generateArray();
  const totalPrice = cart.totalPrice;
  const totalQty = cart.totalQty;


  const newUser = new User({
    name: fullName,
    phoneNumber: phoneNumber,
    address: address,
    email: email,
  });

  const savedUser = await newUser.save();

  // Kiểm tra dữ liệu (có thể thêm điều kiện kiểm tra khác tùy thuộc vào yêu cầu của bạn)

  // Tạo đối tượng Order
  const order = new Order({
      user: savedUser,
      items: cartItemsArray,
      totalPrice,
      note,
      paymentMethod,
      // Thêm các trường khác tùy thuộc vào yêu cầu của bạn
  });

  // Lưu đơn hàng vào cơ sở dữ liệu
  order.save()
      .then(savedOrder => {
          // Xử lý khi đơn hàng đã được lưu thành công
          res.json({ success: true, order: savedOrder });
      })
      .catch(error => {
          // Xử lý khi có lỗi xảy ra
          console.error('Error saving order:', error);
          res.json({ success: false, error: 'Error saving order' });
      });
});

module.exports = router;
