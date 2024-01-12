var express = require('express');
var router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");

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

router.get('/add-product', function (req, res, next) {
  res.render('admin/add-product', { title: 'Express' });
});

router.get('/category', function (req, res, next) {
  res.render('admin/category', { title: 'Express' });
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
