const { parse } = require('dotenv');
const Order = require('../../models/Order')
module.exports = function Cart(oldCart, user) {
    // console.log("***************************OLD CARD CART.js*****************************");
    // console.log(JSON.stringify(oldCart))
    // console.log("***************************OLD CARD CART.js ends*****************************");

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = (oldCart.totalPrice) || 0;
    this.tax = (oldCart.tax) || 0;
    this.shipping = oldCart.shipping || 15;
    this.grandTotal = (oldCart.grandTotal) || 0;
    this.user = user;

    this.add = async function (re, product_id) {

        var cartItem = this.items[product_id];
        // console.log(JSON.stringify(cartItem));

        if (!cartItem) {
            cartItem = this.items[product_id] = { item: re, qty: 0, price: 0 };
        }
        // var cartItem = this.items[product_id];

        cartItem.qty++;
        cartItem.price =  Number(((cartItem.item.price) * parseInt(cartItem.qty).toFixed(2)));
        this.totalQty++;
        this.totalPrice += Math.max(cartItem.item.price);
        this.tax = Number((.05 * this.totalPrice).toFixed(2));
        console.log(this.totalPrice + " "+this.tax + " " + this.shipping + "  vvvvvvvvvvvvvvvvvvv")
        this.grandTotal = (this.totalPrice + this.tax + this.shipping);

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

    this.substract = async function (re, product_id) {

        var cartItem = this.items[product_id];
        console.log(JSON.stringify(cartItem));

        if (!cartItem) {
            cartItem = this.items[product_id] = { item: re, qty: 0, price: 0 };
        }
        // var cartItem = this.items[product_id];

        cartItem.qty--;
        cartItem.price =  Number(((cartItem.item.price) * parseInt(cartItem.qty).toFixed(2)));
        this.totalQty--;
        this.totalPrice -= Math.max(cartItem.item.price);
        this.tax = Number((.05 * this.totalPrice).toFixed(2));
        console.log(this.totalPrice + " "+this.tax + " " + this.shipping + "  vvvvvvvvvvvvvvvvvvv")
        this.grandTotal = (this.totalPrice + this.tax + this.shipping);

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

        //Handle the condition when request contains a product id to be removed which is not in cart
        if(!this.items[id])
            return;
        
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        this.tax = Number((.05 * this.totalPrice).toFixed(2));
        this.grandTotal = (this.totalQty == 0) ? 0 : Number((this.grandTotal - this.items[id].price - Number((.05 * this.items[id].price).toFixed(2))).toFixed(2));

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