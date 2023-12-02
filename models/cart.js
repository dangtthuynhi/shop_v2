class Cart {
  constructor(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }

  add(item, sizePrice, qty) {
    let storedItem = this.items[sizePrice._id];
    if (!storedItem) {
      storedItem = this.items[sizePrice._id] = { item, sizePrice, qty: 0, price: 0 };
    }
    storedItem.qty += qty;
    storedItem.price = storedItem.sizePrice.price * storedItem.qty;
    this.totalQty += qty;
    this.totalPrice += storedItem.sizePrice.price * qty;
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
}

module.exports = Cart;
