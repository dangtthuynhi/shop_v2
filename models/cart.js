class Cart {
  constructor(oldCart) {
    this.items = oldCart ? oldCart.items || {} : {};
    this.totalQty = oldCart ? oldCart.totalQty || 0 : 0;
    this.totalPrice = oldCart ? oldCart.totalPrice || 0 : 0;
  }

  add(item, sizePrice, qty) {
    const sizePriceId = sizePrice._id;
    
    if (!this.items[sizePriceId]) {
      this.items[sizePriceId] = {
        item,
        sizePrice,
        qty,
        price: sizePrice.price * qty,
      };
    } else {
      this.items[sizePriceId].qty += qty;
      this.items[sizePriceId].price = this.items[sizePriceId].sizePrice.price * this.items[sizePriceId].qty;
    }

    this.totalQty += qty;
    this.totalPrice += sizePrice.price * qty;
  }

  reduceByOne(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  }

  removeItem(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  }

  generateArray() {
    const arr = [];
    for (let itemId in this.items) {
      arr.push(this.items[itemId]);
    }
    return arr;
  }

  updateCart(updates) {
    updates.forEach(update => {
      const { itemId, sizePriceId, qty } = update;
      const storedItem = this.items[sizePriceId];

      if (storedItem) {
        this.totalQty -= storedItem.qty;
        this.totalPrice -= storedItem.price;

        storedItem.qty = qty;
        storedItem.price = storedItem.sizePrice.price * qty;

        this.totalQty += qty;
        this.totalPrice += storedItem.price;

        if (qty <= 0) {
          delete this.items[sizePriceId];
        }
      }
    });
  }
}

module.exports = Cart;
