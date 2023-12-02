const mongoose = require('mongoose')
// const faker = require('faker')
const Product = require("../models/product");
const Category = require("../models/category");
const { faker } = require('@faker-js/faker');


mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
});

for (let i = 0; i < 4; i++) {
    const category = new Category({
        title: faker.commerce.productName()
    })

    category.save()
        .then(categoryRef => {
            console.log(`${categoryRef.title} saved successfully`);
            for (let i = 0; i < 15; i++) {
                const product = new Product({
                    category: category._id,
                    productCode: faker.number.int(),
                    title: faker.commerce.productName(),
                    images: [faker.image.url(), faker.image.url(), faker.image.url()],
                    sizePrices: [{ size: faker.number.int(), price: faker.commerce.price()}, { size: faker.number.int(), price: faker.commerce.price()}, { size: faker.number.int(), price: faker.commerce.price()}],
                    description: faker.commerce.productDescription(),
                    available: false,
                })

                product.save()
                    .then(productRef => {
                        console.log(`${categoryRef.title} - ${productRef.title}`)
                    })
            }
        })
}