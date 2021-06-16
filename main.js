const express = require('express');
const app=express();

app.set('view engine', 'ejs'); // configure template engine

app.use('/assets', express.static(__dirname + '/assets'));


// app.use('/views', express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views'); // set express to look in this folder to render our view

var products = 
[
    {
    "p_id": "11",
    "img" : "plate1.png",
    "name" : "Barbecue salad",
    "detail": "[Relieve Stress and Anxiety] : Toys can effectively relieve anxiety and pressure, or kill time at home. This is very useful for people with autism or stress. Bubble sounds can help relieve anxiety and stress and restore mood.",
    "price" : "21.00" 
},
{
    "p_id": "12",
    "img" : "popup.jpg",
    "name" : "Push Pop Bubble Toy",
    "detail": "[Relieve Stress and Anxiety] : Toys can effectively relieve anxiety and pressure, or kill time at home. This is very useful for people with autism or stress. Bubble sounds can help relieve anxiety and stress and restore mood.",
    "price" : "22.00" 
},
{
    "p_id": "13",
    "img" : "plate3.png",
    "name" : "Spinach salad",
    "detail": "Delicious dish",
    "price" : "23.00" 
},
{
    "p_id": "14",
    "img" : "plate1.png",
    "name" : "Barbecue salad",
    "detail": "Delicious dish",
    "price" : "21.00" 
},
{
    "p_id": "15",
    "img" : "plate2.png",
    "name" : "Salad with fish",
    "detail": "Delicious dish",
    "price" : "22.00" 
},
{
    "p_id": "16",
    "img" : "plate1.png",
    "name" : "Barbecue salad",
    "detail": "Delicious dish",
    "price" : "21.00" 
},
{
    "p_id": "17",
    "img" : "plate2.png",
    "name" : "Salad with fish",
    "detail": "Delicious dish",
    "price" : "22.00" 
},
{
    "p_id": "18",
    "img" : "plate1.png",
    "name" : "Barbecue salad",
    "detail": "Delicious dish",
    "price" : "21.00" 
},
{
    "p_id": "19",
    "img" : "plate2.png",
    "name" : "Salad with fish",
    "detail": "Delicious dish",
    "price" : "22.00" 
}

];



app.get('/', (req, res) => {
res.render('index');
//res.json(products);

});

app.get('/listview', (req, res) => {
// res.render('listview');
res.render('listview', {
    title: 'List View',
    data: products
});
});

app.get('/product/:p_id', (req, res) => {
    console.log(products.filter(item => item.p_id === req.params.p_id ));
// res.render('product');
res.render('product', {
    title: 'Product View',
    data: products.filter(item => item.p_id === req.params.p_id )
});
})



const port =8081;

app.listen(port,()=>{
console.log(`App running on ${port}`);
})