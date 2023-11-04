var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Express' });
});

router.get('/products', function(req, res, next) {
  res.render('admin/product', { title: 'Express' });
});

router.get('/add-product', function(req, res, next) {
  res.render('admin/add-product', { title: 'Express' });
});

router.get('/category', function(req, res, next) {
  res.render('admin/category', { title: 'Express' });
});



module.exports = router;
