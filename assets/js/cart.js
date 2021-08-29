const Order = require('../../models/Order')
module.exports = function Cart(oldCart, user) {
    // oldCart = JSON.parse(oldCart)
    console.log("***************************OLD CARD CART.js*****************************");
    console.log(JSON.stringify(oldCart))
    console.log("***************************OLD CARD CART.js ends*****************************");

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = parseFloat(oldCart.totalPrice) || 0;
    this.tax = oldCart.tax || 0;
    this.shipping = oldCart.shipping || 15;
    this.grandTotal = oldCart.grandTotal || 0;
    this.user = user;

    this.add = async function (re, product_id) {

        var cartItem = this.items[product_id];
        // console.log(JSON.stringify(cartItem));

        if (!cartItem) {
            cartItem = this.items[product_id] = { item: re, qty: 0, price: 0 };
        }
        // var cartItem = this.items[product_id];

        cartItem.qty++;
        cartItem.price = ( Math.max(cartItem.item.price) * parseInt(cartItem.qty));
        this.totalQty++;
        this.totalPrice += Math.max(cartItem.item.price);
        this.tax = .05 * (Math.max(this.totalPrice));
        this.grandTotal = parseFloat(this.totalPrice + this.tax + this.shipping);

        await Order.findOneAndDelete({ user: user })
        if (this.user) {
            const order = new Order({
                user: user,
                items: this.items,
                totalQty: this.totalQty,
                totalPrice: this.totalPrice,
                tax: this.tax,
                shipping: this.shipping,
                grandTotal: this.grandTotal,
                isCompleted: true
            })
            await order.save()
        }


    };

    this.remove = async function (id, user) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        this.tax = .05 * this.totalPrice;
        this.grandTotal = (this.totalQty == 0) ? 0 : (this.grandTotal - this.items[id].price - (.05 * this.items[id].price));

        delete this.items[id];

        if(this.totalQty == 0)
            await Order.findOneAndDelete({user: user})
        else
            await Order.findOneAndUpdate({ user: user }, {
                 items: this.items,
                totalQty: this.totalQty,
                totalPrice: this.totalPrice,
                grandTotal: this.grandTotal,
                tax: this.tax
             }, { useFindAndModify: false })
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

};
// this.add = function(re, product_id){

    //     var cartItem = this.items[product_id];
    //     // console.log(JSON.stringify(cartItem));

    //     if (!cartItem) {
    //         cartItem = this.items[product_id] = {item: re, qty: 0, price: 0};
    //     }
    //     // var cartItem = this.items[product_id];

    //     cartItem.qty++;
    //     cartItem.price = (parseFloat(cartItem.item.price) * parseFloat(cartItem.qty));
    //     this.totalQty++;
    //     this.totalPrice += parseFloat(cartItem.item.price);
    //     this.tax = .05 * (parseFloat(this.totalPrice));
    //     this.grandTotal = parseFloat(this.totalPrice + this.tax + this.shipping);
    // };