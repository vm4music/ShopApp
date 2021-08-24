module.exports = function Cart(oldCart){
    this.items =  oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.tax = oldCart.tax || 0;
    this.shipping = oldCart.shipping || 15;
    this.grandTotal = oldCart.grandTotal || 0 ;

    this.add = function(re, product_id){

        var cartItem = this.items[product_id];
        console.log(JSON.stringify(cartItem));

        if (!cartItem) {
            cartItem = this.items[product_id] = {item: re, qty: 0, price: 0};
        }
        // var cartItem = this.items[product_id];
       
        cartItem.qty++;
        cartItem.price = parseFloat(cartItem.item.price) * parseFloat(cartItem.qty);
        this.totalQty++;
        this.totalPrice += parseFloat(cartItem.item.price);
        this.tax = .05 * (parseFloat(this.totalPrice)).toFixed(2);
        this.grandTotal = (this.totalPrice + this.tax + this.shipping).toFixed(2);
    };

    this.remove = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        this.tax = .05 * this.totalPrice;
        this.grandTotal = (this.totalQty == 0)?0:(this.grandTotal - this.items[id].price - (.05 * this.items[id].price));

        delete this.items[id];
    };

    this.generateArray = function(){
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};