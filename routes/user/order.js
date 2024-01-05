var express = require('express');
var router = express.Router();
const Product = require("../../models/product");
const Cart = require('../../models/cart');
const Order = require('../../models/order');
const User = require('../../models/user');
const payOS = require('../../utils/payos');
const Category = require("../../models/category");

// Route để xử lý đơn hàng
router.post('/create-order', async (req, res) => {
    // Lấy dữ liệu từ req.body
    const { fullName, phoneNumber, city, district, ward, address, email, note, paymentMethod } = req.body;
    const cart = new Cart(req.session.cart);
    const cartItemsArray = cart.generateArray();
    const totalPrice = cart.totalPrice;
    const fullAddress = `${address}, ${ward}, ${district}, ${city}`


    const newUser = new User({
        name: fullName,
        phoneNumber: phoneNumber,
        address: fullAddress,
        email: email,
    });

    const savedUser = await newUser.save();

    // Tạo mới các mục (items) của đơn đặt hàng từ giỏ hàng
    const itemPromises = cartItemsArray.map(async (cartItem) => {
        const product = await Product.findById(cartItem.item._id);

        if (!product) {
            return res.status(404).json({ message: `Product with ID ${cartItem.item._id} not found` });
        }

        return {
            product: cartItem.item._id,
            size: cartItem.sizePrice.size,
            quantity: cartItem.qty,
            unitPrice: cartItem.sizePrice.price,
            totalPrice: cartItem.price
        };
    });

    const resolvedItems = await Promise.all(itemPromises);

    // Tạo đối tượng Order
    const order = new Order({
        user: savedUser._id,
        items: resolvedItems,
        totalOrderPrice: totalPrice,
        note,
        paymentMethod,
        // Thêm các trường khác tùy thuộc vào yêu cầu của bạn
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    order.save()
        .then(async savedOrder => {
            req.session.cart = null;
            // Xử lý khi đơn hàng đã được lưu thành công
            if (savedOrder.paymentMethod === "transfer") {
                const body = {
                    orderCode: Number(String(Date.now()).slice(-6)),
                    amount: savedOrder.totalOrderPrice,
                    description: `Thanh toan don hang ${savedOrder.orderNumber}`,
                    returnUrl: `${process.env.YOUR_DOMAIN}/order/get-order/${savedOrder.orderNumber}`,
                    cancelUrl: `${process.env.YOUR_DOMAIN}/checkout`
                };

                try {
                    const paymentLinkResponse = await payOS.createPaymentLink(body);
                    res.redirect(paymentLinkResponse.checkoutUrl);
                } catch (error) {
                    console.error(error);
                    return res.redirect('/checkout');
                }
            }
            else {
                return res.redirect(`/order/get-order/${savedOrder.orderNumber}`);
            }
        })
        .catch(error => {
            // Xử lý khi có lỗi xảy ra
            console.error('Error saving order:', error);
            return res.redirect('/checkout');
        });
});

router.get('/get-order/:orderNumber', async function (req, res) {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber })
            .populate('user')
            .populate({
                path: 'items.product',
                populate: {
                    path: 'category',
                    model: 'Category',
                },
            });

        console.log(order);
        const categories = await Category.find({});
        const cart = new Cart(req.session.cart);
        const cartItemsArray = cart.generateArray();
        return res.render("user/order-info", {
            pageName: "Đặt hàng thành công",
            order,
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

module.exports = router;