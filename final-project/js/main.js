
window.onload = () => {
    document.body.style.height = "100vh"
    document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
    document.body.style.backgroundPosition = "50% 50%";

    document.querySelector("#cartIcon").addEventListener("click", () => {
        window.location.assign("cart.html")
    });
    document.querySelector("#adminIcon").addEventListener("click", () => {
        window.location.assign("admin.html")
    });
    document.querySelector("#cartIcon").addEventListener("click", () => {
        document.querySelector("#cart-modal-div").classList.remove("toggle");
    });

    document.querySelector("#search-input").addEventListener("keyup", event => {
        var searchFor = event.target.value;
        document.querySelector("#items-display").innerHTML = '';
        for (key in products) {
            if (products[key].category.includes(searchFor.toLowerCase()) || products[key].name.includes(searchFor.toLowerCase()))
                display();
        }
    });

    fetch(`https://online-shop-a4050.firebaseio.com/.json`)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            } else if (response.ok && response.status === 200) {
                return response.json();
            }
        })
        .then(response => {
            console.log(response)
            window.products = response;
            document.body.style.height = '';
            document.body.style.background = '';
            document.body.style.backgroundPosition = "";

            for (key in products) 
                
                display();
            counterUpdate();

            var cards = document.querySelectorAll(".display-item");
            console.log(cards);
            cards.forEach(element => {
                element.addEventListener('onmouseover', (element) => { element.classList.add("isInFocus") });
            })


        })
}
function counterUpdate() {
    cart = JSON.parse(localStorage.getItem('cart'));
    var counter = 0;
    if (Object.keys(cart).length > 0) {
        for (key in cart) {
            counter += cart[key].quantity;
        }
    }
    document.querySelector("#counter").innerHTML = counter;
}

function display() {
    // document.querySelector("#items-display").innerHTML = '';
    document.querySelector("#items-display").innerHTML += `
                    <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 text-center ">
                        <div class = "display-item">
                            <div>
                                <img class = "display-img card-img-top" onclick = "details(${key})" src="${products[key].image}" alt="">
                            </div>
                            <div id = 'h'><h6  class = "product-name" >${products[key].name}</h6></div>
                            <div ><p class = "product-price mx-auto">$${products[key].price}</p></div>
                            <div class = "tocart text-center" ><button class="to-cart-btn" onclick = "addToCart(${key})" id = "addTocart" >Add to Cart<i id = "addedToCart" class="fas "></i></button></div>
                        </div>
                    </div>
                `;

}

function details(key) {
    window.location.assign(`details.html?id=${key}`);
}

function cartInit() {
    if (localStorage.length > 0)
        cart = JSON.parse(localStorage.getItem('cart'));
    else
        cart = {};
    return cart;
}

function addToCart(key) {
    var cart = cartInit();
    fetch(`https://online-shop-a4050.firebaseio.com/${key}.json`)
        .then(response => {
            return response.json();
        })
        .then(response => {
            window.toCartProduct = response;
        })
        .then(() => {
            if (cart[key]) {
                if (cart[key].stock > 0) {
                    cart[key].quantity += 1;
                    cart[key].stock -= 1;
                    cart[key].total += cart[key].price * 1
                    localStorage.setItem('cart', JSON.stringify(cart));
                    Swal.fire({
                        type: 'success',
                        title: 'Added to cart',
                    });
                    counterUpdate();
                } else {
                    Swal.fire('This item is out of stock!')
                }

                
            } else {
                if (toCartProduct.stock > 0) {

                    cart[key] = {
                        image: toCartProduct.image,
                        name: toCartProduct.name,
                        price: toCartProduct.price,
                        stock: toCartProduct.stock - 1,
                        quantity: 1,
                        total: toCartProduct.price * 1
                    };
                    localStorage.setItem('cart', JSON.stringify(cart));
                    Swal.fire({
                        type: 'success',
                        title: 'Added to cart',
                        // text: 'Something went wrong!',
                        // footer: '<a href>Why do I have this issue?</a>'
                    });
                    counterUpdate()
                } else {
                    Swal.fire('This item is out of stock!')
                }

            }
        })
}

// function compare(a, b) {
//     if ((a.price) * 1 < (b.price) * 1) {
//         return -1;
//     }
//     if ((a.price) * 1 > (b.price) * 1) {
//         return 1;
//     }
//     return 0;
// }

// function sortBy(event) {
//     var toSort = [];
//     for (var key in products) {
//         toSort.push(products[key])
//     }

//     if (event.target.id === 1) {
//         for (var i of toSort) {
//             toSort.sort(function(toSort[i], toSort[i+1]){
                
//             })
//         }
//     } else if (event.target.id === 1) {
//         toSort.sort(compare(toSort[i + 1], toSort[i]))
//     }
//     return toSort;
// }




