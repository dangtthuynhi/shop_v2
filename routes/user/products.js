const express = require('express');
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");

// GET: display all products
router.get("/", async (req, res) => {
  const perPage = 9;
  const page = parseInt(req.query.page) || 1;

  try {
    const products = await Product.find({})
      .sort("createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const categories = await Category.find({});

    const count = await Product.countDocuments();

    console.log(products);

    res.render("user/product", {
      pageName: "Sản phẩm",
      products,
      categories,
      current: page,
      breadcrumbs: null,
      home: "/product/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// GET: search box
router.get("/search", async (req, res) => {
  const perPage = 9;
  const page = parseInt(req.query.page) || 1;

  try {
    const products = await Product.find({
      title: { $regex: req.query.search, $options: "i" },
    })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category")
      .exec();

    const count = await Product.countDocuments({
      title: { $regex: req.query.search, $options: "i" },
    });

    const categories = await Category.find({});

    res.render("user/product", {
      pageName: "Tìm kiếm",
      products,
      categories,
      current: page,
      breadcrumbs: null,
      home: `/product/search?search=${req.query.search}&`,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// GET: get a certain category by its slug (this is used for the categories navbar)
router.get("/:slug", async (req, res) => {
  const perPage = 9;
  const page = parseInt(req.query.page) || 1;

  try {
    const foundCategory = await Category.findOne({ slug: req.params.slug });

    const allProducts = await Product.find({ category: foundCategory._id })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.countDocuments({ category: foundCategory.id });

    const categories = await Category.find({});

    res.render("user/product", {
      pageName: foundCategory.title,
      currentCategory: foundCategory,
      products: allProducts,
      categories,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: `/product/${req.params.slug.toString()}/?`,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

// GET: display a certain product by its id
router.get("/:slug/:productCode", async (req, res) => {
  try {
    const product = await Product.findOne({ productCode: req.params.productCode }).populate("category");
    
    const foundCategory = await Category.findOne({ slug: req.params.slug });
    
    const relatedProducts = await Product.find({ category: foundCategory.id })
      .sort("-createdAt")
      .limit(6)
      .populate("category");
    
      res.render("user/product-detail", {
      pageName: product.title,
      product,
      relatedProducts,
      home: `/product/${req.params.slug.toString()}/${product.slug}/?`,
      moment,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

module.exports = router;
