const express = require('express');
const app=express();

app.set('view engine', 'ejs'); // configure template engine

app.use('/assets', express.static(__dirname + '/assets'));


// app.use('/views', express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
var about_us = {
    "title":"Our children deserve the best",
    "descripton_line_1": "Play is a Child’s Work and Our Store is a child’s workshop of award-winning toys carefully selected for excellence in play value, design, quality and impact on environment. Every toy we choose is evaluated for these qualities and we do not compromise because we believe our children deserve the best.",
    "descripton_line_2": "Anything else is just not good enough."
}
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
    "img" : "Rickshaw.jpg",
    "name" : "Plastic Pull Back Auto Rickshaw",
    "detail": "Plastic Pull Back Auto Rickshaw",
    "price" : "129.00" 
},
{
    "p_id": "14",
    "img" : "eboard.jpg",
    "name" : "LCD Writing Tablet 8.5Inch E-Note Pad",
    "detail": "LCD Writing Tablet 8.5Inch E-Note Pad",
    "price" : "21.00" 
},
{
    "p_id": "15",
    "img" : "train.jpg",
    "name" : "Electric Train Toy",
    "detail": "REALISTIC HEADLIGHT, SOUNDS & SMOKE",
    "price" : "22.00" 
},
{
    "p_id": "16",
    "img" : "bullet_train.jpg",
    "name" : "3D Lightning Electric Train",
    "detail": "Children can watch the train move forward, backward and spin 360 degrees on any flat surface. If it crashes into the wall or an object, it automatically changes its direction on contact.",
    "price" : "21.00" 
},
{
    "p_id": "17",
    "img" : "laptop.jpg",
    "name" : "Kids Laptop",
    "detail": "Great educational toy for kids",
    "price" : "22.00" 
},
{
    "p_id": "18",
    "img" : "laptop_2.jpg",
    "name" : "Learning Educational Laptop",
    "detail": "Smart English learning Laptop is fashionable multi-function touch screen.",
    "price" : "21.00" 
},
{
    "p_id": "19",
    "img" : "Ring_toy.jpg",
    "name" : "Rings for Toddlers",
    "detail": "Stacking Ring is an attractive educational toy which helps your baby recognize different colours and sizes while having fun stacking them in order. Stacking Ring helps your baby naturally develop concepts of colour, shape and size through fun filled play activity.",
    "price" : "138.00" 
}

];



app.get('/', (req, res) => {
// res.render('index');
res.render('index', {
    title: 'Little Bugs',
    about: about_us,
    data: products
});

});

app.get('/shop', (req, res) => {
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



const port =process.env.PORT||8081;

app.listen(port,()=>{
console.log(`App running on ${port}`);
})

