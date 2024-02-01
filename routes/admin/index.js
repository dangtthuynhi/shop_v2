var express = require('express');
var router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const Order = require("../../models/order");
const multer = require('multer');
const path = require('path');

// Set up the upload directory
const uploadDirectory = '/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    // Use the original file name for simplicity
    cb(null, file.originalname);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


// Handle POST requests to the /fileuploader endpoint
router.post('/fileuploader', upload.single('files'), (req, res) => {
  // File uploaded successfully
  res.json({ success: true, message: 'File uploaded successfully' });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin/index', { title: 'Express' });
});

router.get('/products', async function (req, res, next) {
  try {
    const products = await Product.find({})
      .sort("createdAt")
      .populate("category");

    res.render('admin/product', {
      title: 'Express',
      products
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get('/products', async function (req, res, next) {
  try {
    const products = await Product.find({})
      .sort("createdAt")
      .populate("category");

    res.render('admin/product', {
      title: 'Express',
      products
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get('/add-product', function (req, res, next) {
  res.render('admin/add-product', { title: 'Express' });
});

router.get('/category', function (req, res, next) {
  res.render('admin/category', { title: 'Express' });
});

router.get('/order', async function (req, res, next) {
  try {
    const orders = await Order.find({})
    .sort("createdAt")
    .populate({
      path: 'user',
      model: 'User', // The model you're referring to
    })
    .populate({
      path: 'items.product',
      model: 'Product', // The model you're referring to
    });
  
  console.log(orders);

    res.render('admin/orders', {
      title: 'Express',
      orders
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});



router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    // console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
