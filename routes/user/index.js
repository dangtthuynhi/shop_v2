var express = require('express');
var router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products', localField: '_id',
          foreignField: 'category', as: 'products'
        },
      },
    ]);
    console.log(categories);
    res.render("user/index", { pageName: "Trang chủ", categories });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
