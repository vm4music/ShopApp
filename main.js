const express = require('express');
const app=express();

app.set('view engine', 'ejs'); // configure template engine

app.use('/assets', express.static(__dirname + '/assets'));

// app.use('/views', express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
//use node main.js for production 


var about_us = {
    "title":"Our children deserve the best",
    "descripton_line_1": "Play is a Child’s Work and Our Store is a child’s workshop of award-winning toys carefully selected for excellence in play value, design, quality and impact on environment. Every toy we choose is evaluated for these qualities and we do not compromise because we believe our children deserve the best.",
    "descripton_line_2": "Anything else is just not good enough."
}
var products = 
[
    {
    "p_id": "11",
    "img" : "rc_car-removebg-preview.png",
    "name" : "Racing truck",
    "detail": [  "Big and mean rock crawling scale monster truck.",
                 "With shock suspension system and rubber tires, drive this masterpiece on the earth, grass or sands."
                ],
    "price" : "21.00" 
},
{
    "p_id": "12",
    "img" : "popup-removebg-preview.png",
    "name" : "Push Pop Bubble Toy",
    "detail": [
        "[Relieve Stress and Anxiety] : Toys can effectively relieve anxiety and pressure, or kill time at home.",
        "This is very useful for people with autism or stress. Bubble sounds can help relieve anxiety and stress and restore mood."
    ],
    "price" : "22.00" 
},
{
    "p_id": "13",
    "img" : "Rickshaw-removebg-preview.png",
    "name" : "Plastic Pull Back Auto Rickshaw",
    "detail": ["Plastic Pull Back Auto Rickshaw"],
    "price" : "129.00" 
},
{
    "p_id": "14",
    "img" : "eboard.jpg",
    "name" : "LCD Writing Tablet 8.5Inch E-Note Pad",
    "detail": ["LCD Writing Tablet 8.5Inch E-Note Pad"],
    "price" : "21.00" 
},
{
    "p_id": "15",
    "img" : "train.jpg",
    "name" : "Electric Train Toy",
    "detail": ["REALISTIC HEADLIGHT, SOUNDS & SMOKE"],
    "price" : "22.00" 
},
{
    "p_id": "16",
    "img" : "bullet_train.jpg",
    "name" : "3D Lightning Electric Train",
    "detail": ["Children can watch the train move forward, backward and spin 360 degrees on any flat surface.",
                "If it crashes into the wall or an object, it automatically changes its direction on contact."],
    "price" : "21.00" 
},
{
    "p_id": "17",
    "img" : "laptop.jpg",
    "name" : "Kids Laptop",
    "detail": ["Great educational toy for kids"],
    "price" : "22.00" 
},
{
    "p_id": "18",
    "img" : "laptop_2.jpg",
    "name" : "Educational Laptop",
    "detail": ["Smart English learning Laptop is fashionable multi-function touch screen."],
    "price" : "21.00" 
},
{
    "p_id": "19",
    "img" : "Ring_toy.jpg",
    "name" : "Rings for Toddlers",
    "detail": ["Stacking Ring is an attractive educational toy which helps your baby recognize different colours and sizes while having fun stacking them in order.",
                "Stacking Ring helps your baby naturally develop concepts of colour, shape and size through fun filled play activity."],
    "price" : "138.00" 
},
{
    "p_id": "20",
    "img" : "fire_truck.jpg",
    "name" : "Fire Truck",
    "detail": ["Develops these skills sensory, fine motor, gross motor, logical, creative, linguistic, emotional, communication and self esteem",
                "Made with non toxic material safe for children"],
    "price" : "138.00",
    "link" : "https://www.amazon.in/Parteet-Small-Cement-Mixture-Trucks/dp/B07SZTF8CD/ref=sr_1_30?dchild=1&keywords=malhotra+toys&qid=1627205713&sr=8-30"
},
{
    "p_id": "21",
    "img" : "doll_house.jpg",
    "name" : "Girls Mini Dolls House",
    "detail": ["Non-Toxic Plastic",
                "Premium Quality."],
    "price" : "138.00",
    "link" : "amazon.in/FUNTOOL-Girls-Dolls-Non-Toxic-Plastic/dp/B08QFXHHY3/ref=sr_1_51?dchild=1&keywords=malhotra+toys&qid=1627205713&sr=8-51"
},
{
    "p_id": "22",
    "img" : "mechanix_educational.jpg",
    "name" : "Mechanix Educational kit",
    "detail": ["The Educational Mechanix Metal- 4 game for kids with different 20 models of building & construction toys and 263 color coated parts.",
                "A step by step manual guide to enable your child to learn the basics of fitting and guide him through the process.",
            "This mechanix metal- 4 game comes with all the tools and parts to build 20 different models. After completing these 20 models, the builder can use the nuts bolts and other versatile parts to create many more models and projects.",
        "Mechanix metal- 4 game is made from high quality of steel and it is perfectly finished for the ideal and no sharp edges, smooth finish."],
    "price" : "138.00" 
},
{
    "p_id": "23",
    "img" : "rc_helicopter.jpg",
    "name" : "Remote Controlled Helicopter",
    "detail": ["One recharageble helicopter , one fully functional remote, one charging cable for the helicopter.",
                "Flying height : 10m , weight : 132g, Remote is included, it has a built in sensor which allows the helicopter to sense anything below it to move upwards Guide the movement of the helicopter by placing your hands underneath it please use new batteries in the remote and charge the helicopter for 1 hr before first use.",
            "3.7V 160mAH Lithium Polymer also known as Lipo Rechargeable Battery is used in the product they are thin, light and powerful. Which makes this product unique in its segment, Batteries for the remote not included.",
        "Dimension :- 17.5X3.5X10.7 ; Weight :- 132 GM"],
    "price" : "138.00",
    "link" : "https://www.amazon.in/Alakh-Enterprise-Plastic-Control-Helicopter/dp/B098Z1M5YJ/ref=sr_1_6?dchild=1&keywords=toys&nav_sdd=aps&pd_rd_r=a43e72db-06b9-40b4-8cf3-62da00eae66f&pd_rd_w=fF8hw&pd_rd_wg=YtWLy&pf_rd_p=bea0f565-2d03-4602-9e75-f5756c884efc&pf_rd_r=FC2ADZXDAPK2FX6XADZ8&qid=1627205876&refinements=p_n_age_range%3A1480708031&s=toys&sr=1-6"
},
{
    "p_id": "24",
    "img" : "golf.jpg",
    "name" : "Golf kit with Accessories",
    "detail": ["Licensed and Authentic Marvel avanger Golf kit for kids.",
                "[ Package Includes ] - 1 Club holder with wheels, 3 clubs , 2 balls , 1 practice hole with a flag.",
            "Strong sturdy and fine finish and made of Non Toxic- Plastic 100 % Safe for Children,Complies to European Safety Standards EN-71",
        "[ Gift ] - Best gift for kids. its very entertaining game for kids"],
    "price" : "138.00",
    "link" : "https://www.amazon.in/Fletix-Big-Size-Golf-Accessories/dp/B098JCDJDW/ref=sr_1_31_sspa?dchild=1&keywords=toys&nav_sdd=aps&pd_rd_r=a43e72db-06b9-40b4-8cf3-62da00eae66f&pd_rd_w=fF8hw&pd_rd_wg=YtWLy&pf_rd_p=bea0f565-2d03-4602-9e75-f5756c884efc&pf_rd_r=FC2ADZXDAPK2FX6XADZ8&qid=1627205876&refinements=p_n_age_range%3A1480708031&s=toys&sr=1-31-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExMVFFSlc3VkVHOVIxJmVuY3J5cHRlZElkPUEwMDc0NDM5MVdLR1o1MjUzVkQ0VyZlbmNyeXB0ZWRBZElkPUEwMTU4NDE0MzU4Q0VJTlNNTzJQViZ3aWRnZXROYW1lPXNwX2J0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="
},
{
    "p_id": "25",
    "img" : "kids_drum.jpg",
    "name" : "Flash Drums",
    "detail": ["Material: made from abs plastic to kids. Round design protects your kids little hands. Intended for babies and toddlers 6+ months.",
                "Multifunction: multiple early education content, 3 gameplay modes, 9 different drum sound 5 colour of light, 9 dulcet songs.",
            "Best gift for baby: multiple functions are attractive to your baby. A good musical toy to improve kids intelligence, imagination and creativity"],
    "price" : "138.00",
    "link" : "https://www.amazon.in/Zuffon-Kids-Flash-Lights-Musical/dp/B07J5CST1W/ref=sr_1_4?dchild=1&keywords=toys&nav_sdd=aps&pd_rd_r=a43e72db-06b9-40b4-8cf3-62da00eae66f&pd_rd_w=fF8hw&pd_rd_wg=YtWLy&pf_rd_p=bea0f565-2d03-4602-9e75-f5756c884efc&pf_rd_r=FC2ADZXDAPK2FX6XADZ8&qid=1627205913&refinements=p_n_age_range%3A1480705031&s=toys&sr=1-4"
},
{
    "p_id": "26",
    "img" : "jumping_puppy-removebg-preview.png",
    "name" : "Fantastic puppy Dog",
    "detail": ["This Fantastic Puppy is a real looking electronic puppy that acts like a real alive puppy by naturally walking, barking, jumping & taking a complete Somersault.",
                "This is the wonderful funny and awesome entertainment for your little one."],
    "price" : "138.00",
    "link" : "https://www.amazon.in/JANKI-ENTERPRISE-Fantastic-Jumping-Walking/dp/B08CMMK6CD/ref=sr_1_31_sspa?dchild=1&keywords=toys&nav_sdd=aps&pd_rd_r=a43e72db-06b9-40b4-8cf3-62da00eae66f&pd_rd_w=fF8hw&pd_rd_wg=YtWLy&pf_rd_p=bea0f565-2d03-4602-9e75-f5756c884efc&pf_rd_r=FC2ADZXDAPK2FX6XADZ8&qid=1627205913&refinements=p_n_age_range%3A1480705031&s=toys&sr=1-31-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyTjE0MU5OUTBEVzM3JmVuY3J5cHRlZElkPUEwNjMyOTI4M0pPQjVITjZFTlJYMyZlbmNyeXB0ZWRBZElkPUEwOTUxNTQyMk1DVkxTREFRNEczSyZ3aWRnZXROYW1lPXNwX2J0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="
},
{
    "p_id": "27",
    "img" : "ben10_laptop.jpg",
    "name" : "Ben10 Educational Laptop",
    "detail": ["Laptop NoteBook Computer with Mouse learning Pad with 20 Activities & Games.",
                "Educational Toy to Teaches Spelling, Vocabulary, Mathematics and much more .Helps in alphabets recognition & pronunciation, spelling test, identification of pictures etc.",
            "Improves the Child's Ability to Handle practical with lot of fun, Inspires the Child's Imagination & Promotes Their Intellectual development",
        "A keypad and a mouse have been provided to make it look just like real laptop. The grey toy laptop is made from durable plastic and is safe for kids to use."],
    "price" : "138.00",
    "link" : "https://www.amazon.in/TOMZEE-TOYS-Notebook-Activities-Including/dp/B0993F5Z7G/ref=sr_1_29?dchild=1&keywords=toys&qid=1627205873&sr=8-29"
}

];

//========== API Response ============//
app.get('/api/shop', (req, res) => {

    let list = {};
    list.result = products;
    list.qry = "Welcome to shop";

    res.json(list);
});



//\\======= API Response ENDS ========//\\

//========== ROUTERS START =============//
app.get('/', (req, res) => {
// res.render('index');
res.render('index', {
    title: 'Little Bugs',
    about: about_us,
    data: products
});

});

app.get('/shop', (req, res) => {

    let list = {};
    list.result = products;
    list.qry = "Welcome to shop";

// res.render('listview');
res.render('listview', {
    title: 'List View',
    data: list
});
});


//========== full word based search ================//
app.get('/search', (req, res) => {
    let qry = req.query.searchbar.toLowerCase();
    //console.log(products.filter(item => item.name.toLowerCase().includes(qry) ));
    let search = {};
    search.result = products.filter(item => item.name.toLowerCase().includes(qry) );
    
    search.qry = search.result.length!=0?qry:"No Results found for this keyword(s)...";
    res.render('listview', {
        title: 'List View',
        data: search
    });
    });


//=========== KEYWORD BASED SEARCH =============//
    app.get('/searchkey', (req, res) => {
        let finalResult = [];
        let keywords = req.query.searchbar.toLowerCase().split(' ');
        let search = {};
      
        keywords.forEach(element => {
            let arr = products.filter(item => item.name.toLowerCase().includes(element) );
            finalResult = (finalResult.length==0)?arr:finalResult.concat(arr);
            
        });
        
        search.result = finalResult;
        search.qry = finalResult.length!=0?"Results for: \""+ req.query.searchbar + "\"" :"No Results found for the keyword(s)...\" "+ req.query.searchbar + "\"";
        
        res.render('listview', {
            title: 'List View',
            data: search
        });
        });
    
    
app.get('/product/:p_id', (req, res) => {
    console.log(products.filter(item => item.p_id === req.params.p_id ));
    let list = {};
    list.result = products.filter(item => item.p_id === req.params.p_id );
    list.qry = "New Arrivals";
res.render('product', {
    title: 'Product View',
    data: products.filter(item => item.p_id === req.params.p_id )
});
})



const port =process.env.PORT||8081;

app.listen(port,()=>{
console.log(`App running on ${port}`);
})

