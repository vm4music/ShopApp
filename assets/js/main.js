/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    // Validate that variables exist
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        // if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
        //     document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        // }else{
        //     document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        // }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 200) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL TOP ====================*/ 
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 2000,
    reset: true
});

sr.reveal(`.home__data, .home__img,
            .about__data, .about__img,
            .services__content, .menu__content,
            .app__data, .app__img,
            .contact__data, .contact__button,
            .footer__content, .shopping-cart, .l-form`, {
    interval: 200
})

// Login Form added by Vikas
/*===== FOCUS =====*/
const inputs = document.querySelectorAll(".form__input")

/*=== Add focus ===*/
function addfocus(){
    let parent = this.parentNode.parentNode
    parent.classList.add("focus")
}

/*=== Remove focus ===*/
function remfocus(){
    let parent = this.parentNode.parentNode
    if(this.value == ""){
        parent.classList.remove("focus")
    }
}

/*=== To call function===*/
inputs.forEach(input=>{
    input.addEventListener("focus",addfocus)
    input.addEventListener("blur",remfocus)
})

/*==================== Added by Vikas ====================*/


/*==================== SHOW SEARCH ====================*/
const toggled = document.getElementById('sort-dropdown'),
    sort = document.getElementsByClassName('dropdown-content')
// search[0].style.display = "none";
if(toggled){
    toggled.addEventListener('click', () => {
    
        if (sort[0].style.display === "none" || sort[0].style.display == "") {
            sort[0].style.display = "block";
    } else {
        sort[0].style.display = "none";
            }
})    
}

if(document.getElementsByClassName('heart__button')){
$(document).ready(function(){

    $('.heart__button').on('click',function(e){
         e.preventDefault();
 
         $("#heart").toggleClass("bxs-heart")
         $("#heart").toggleClass("bx-heart")
 
        $.ajax({
            url : "/wishlist",
            data : {
                wishlist : $("#wishlist").val(),
                pid : $("#pid").val()
            },
            method : "POST",
            contentType : "application/x-www-form-urlencoded",
            success : function(res){
                if(res.message){
                    $(".alert").text(res.message)
                }else{
                    window.location.href = "/users/login"
                }
                
            },
            error : function(error){
                console.log(error)
            }
        })
 
    });
})
}

if(document.getElementsByClassName('heart__button__list')){
    $(document).ready(function(){
    
        $('.heart__button__list').on('click',function(e){
             e.preventDefault();

             var form = $(this).closest('form');
             var formdata = form.serialize().toString();
             var id = formdata.substr(formdata.indexOf("pid") + 4);
console.log(id )
             $("#heart_"+ id).toggleClass("bxs-heart")
             $("#heart_"+ id).toggleClass("bx-heart")
     
            $.ajax({
                url : "/wishlist",
                data :form.serialize(),
                method : "POST",
                contentType : "application/x-www-form-urlencoded",
                success : function(res){
                    if(res.message){
                        $(".alert").text(res.message)
                        console.log(res.message)
                    }else{
                        window.location.href = "/users/login"
                    }
                    
                },
                error : function(error){
                    console.log(error)
                }
            })
     
        });
    })
    }


/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById('sign-up'),
    signIn = document.getElementById('sign-in'),
    loginIn = document.getElementById('login-in'),
    loginUp = document.getElementById('login-up')


signUp.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('block')
    loginUp.classList.remove('none')

    // Add classes
    loginIn.classList.toggle('none')
    loginUp.classList.toggle('block')
})

signIn.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('none')
    loginUp.classList.remove('block')

    // Add classes
    loginIn.classList.toggle('block')
    loginUp.classList.toggle('none')
})