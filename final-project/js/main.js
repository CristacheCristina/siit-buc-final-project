
window.onload = () => {
    loader();
    document.querySelector("#cart").addEventListener("click", () => {
        window.location.assign("cart.html")
    });
    document.querySelector("#admin").addEventListener("click", () => {
        window.location.assign("admin.html")
    });

    document.querySelector("#home").addEventListener("click", () => {
        window.location.assign("index.html")
    });
    document.querySelector("#scrollTop").addEventListener("click", topFunction);

    document.querySelector("#search-input").addEventListener("keyup", event => {
        var searchFor = event.target.value;
        document.querySelector("#items-display").innerHTML = '';
        for (key in products) {
            if (products[key].category.includes(searchFor.toLowerCase()) || products[key].name.includes(searchFor.toLowerCase()))
                display();
        }
    });

    getAndDisplay();
}
async function getAndDisplay() {
    try {
        var data = await fetch(`https://online-shop-a4050.firebaseio.com/.json`);
        window.products = await data.json();
        counterUpdate();
        loader();
        display();
    } catch (error) { console.error(error) }
}
function loader() {
    if (document.body.hasAttribute("load")) {
        document.body.removeAttribute("load");
        document.body.setAttribute("loaded", "true");
        document.body.style.height = "100vh"
        document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
        document.body.style.backgroundPosition = "50% 50%";

    } else if (document.body.hasAttribute("loaded")) {
        document.body.style.height = '';
        document.body.style.background = '';
        document.body.style.backgroundPosition = "";
    }
}
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        document.querySelector("#scrollTop").style.display = "block";
    } else {
        document.querySelector("#scrollTop").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
function counterUpdate() {
    var cart = cartInit();
    var counter = 0;
    if (Object.keys(cart).length > 0) {
        for (key in cart) {
            counter += cart[key].quantity;
        }
    }
    document.querySelector("#counter").innerHTML = counter;
}

function display() {
    var images;
    for (key in products) {
        images = products[key].images.split(" ");
        document.querySelector("#items-display").innerHTML += `
                    <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 text-center ">
                        <div class = "display-item">
                            <div>
                                <img class = "display-img card-img-top" onclick = "details('${key}')" src="../images/${images[0]}" alt="">
                            </div>
                            <div id = 'h'><h6  class = "product-name" >${products[key].name}</h6></div>
                            <div ><p class = "product-price mx-auto">$${products[key].price.toFixed(2)}</p></div>
                            <div class = "tocart text-center" ><button class="to-cart-btn" onclick = "addToCart('${key}')" id = "addTocart" >Add to Cart<i id = "addedToCart" class="fas "></i></button></div>
                        </div>
                    </div>
                `;
    }
}

function details(key) {
    window.location.assign(`details.html?id=${key}`);
}

function cartInit() {
    cart;
    if (localStorage.getItem("cart"))
        cart = JSON.parse(localStorage.getItem('cart'));
    else
        cart = {};
    return cart;
}

async function addToCart(key) {
    var cart = cartInit();
    try {
        var data = await fetch(`https://online-shop-a4050.firebaseio.com/${key}.json`);
        var toCartProduct = await data.json();
        if (cart[key]) {
            if (cart[key].stock > 0) {
                cart[key].quantity += 1;
                cart[key].stock -= 1;
                cart[key].total += cart[key].price * 1
                localStorage.setItem('cart', JSON.stringify(cart));
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Added to cart!',
                    showConfirmButton: false,
                    timer: 3000
                });
                counterUpdate();
            } else {
                Swal.fire('This item is out of stock!')
            }
        } else {
            if (toCartProduct.stock > 0) {

                cart[key] = {
                    images: toCartProduct.images,
                    name: toCartProduct.name,
                    price: toCartProduct.price,
                    stock: toCartProduct.stock - 1,
                    quantity: 1,
                    total: toCartProduct.price * 1
                };
                localStorage.setItem('cart', JSON.stringify(cart));
                Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Added to cart!',
                    showConfirmButton: false,
                    timer: 2000
                });
                counterUpdate()
            } else {
                Swal.fire('This item is out of stock!')
            }

        }
    } catch (error) { console.error(error) }

}

