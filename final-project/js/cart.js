window.onload = () => {
    document.body.style.height = "100vh"
    document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
    document.body.style.backgroundPosition = "50% 50%";
    window.cart = JSON.parse(localStorage.getItem('cart'));


    document.querySelector("#cartIcon").addEventListener("click", () => {
        window.location.assign("cart.html")
    });

    document.querySelector("#adminIcon").addEventListener("click", () => {
        window.location.assign("admin.html")
    });

    getUpdateAndDisplay();

}
async function getUpdateAndDisplay() {
    try {
        var getDb = await fetch(`https://online-shop-a4050.firebaseio.com/.json`);
        window.products = await getDb.json();
        for (key in cart) {
            cart[key].stock = products[key].stock;
        }
        for (key in cart) {
            if (!products[key]) {
                Swal.fire({
                    title: 'Something went wrong!',
                    text: `${cart[key].name} is no longer available and we deleted it from your cart!`,
                    type: 'info',
                    showConfirmButton: false,
                    timer: 3000
                })
                    .then(() => {
                        delete cart[key];
                    })
            }
        }
        document.body.style.height = ""
        document.body.style.background = '';
        document.body.style.backgroundPosition = '';
        if (Object.keys(cart).length > 0) {
            for (key in cart) {
                cart[key].stock = products[key].stock;
                console.log(cart[key]);
                displayCart();
                counterUpdate();
            }
        } else {
            console.log(cart);
            cartReset();
            counterUpdate();
        }
    } catch (error) {
        console.error(error)
    }

}

function counterUpdate() {
    if (Object.keys(cart).length > 0) {
        document.querySelector("#counter").innerHTML = totalItems;
    }
    else if (Object.keys(cart).length === 0) {
        document.querySelector("#counter").innerHTML = 0;
    }
}
function displayCart() {
    var images = cart[key].images.split(" ");
    document.querySelector("thead").innerHTML = '';
    document.querySelector('tbody').innerHTML = '';
    document.querySelector("#checkout").innerHTML = '';
    if (cart !== null && Object.keys(cart).length > 0) {
        document.querySelector("thead").innerHTML = `
            <tr>
                <th></th>
                <th class="image" ></th>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
        `;
        var width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        if (width < 600) {
            let ths = document.querySelectorAll("th");
            for (elem in ths) {
                elem.innerHTML += ":"
            }
        }
        var total = 0;
        window.totalItems = 0;
        for (key in cart) {
            document.querySelector('tbody').innerHTML += `
            <tr>
                <td class= "x"><div id = "x-icon" onclick = "remove(${key})"><i class="fas fa-times" id = "icon${key}"></i></div></td>
                <td class = "image "><a href = "details.html?id=${key}"><img style = "height:100px;width:auto;" src = "../images/${images[0]}"></a></td>
                <td class = "name"><a href = "details.html?id=${key}">${cart[key].name}</a></td>
                <td class = "price" id = "${key}">$${cart[key].price}</td>
                <td>${cart[key].stock}</td>
                <td class = "quantityTd"><div class="my-auto"><i data-id = "decrement${key}" class = "fas fa-arrow-circle-left decrement my-auto" onclick = "reduce(${key});"></i><input type = "text" value = ${cart[key].quantity} data-id = "input${key}" class = "mx-1 quantity" disabled ><i data-id = "increment${key}" class = "fas fa-arrow-circle-right increment  my-auto" onclick = "increase(${key})"></i></div></td>
                <td >$<span id = "total${key}" class = "total">${cart[key].price * cart[key].quantity}</span></td>
            </tr>
            `;
            total += cart[key].price * cart[key].quantity;
            window.totalItems += cart[key].quantity;

            document.querySelector("#checkout").innerHTML = `
                     <tbody>
                        <tr>
                            <th>Subtotal</th>
                            <td id="subtotal">$${total}</td>
                        </tr>
                        <tr>
                            <th>Shipping</th>
                            <td class="shipping">Free shipping<br>
                                Shipping options will be updated during checkout
                            </td>
                        <tr>
                            <th>Total</th>
                            <td id="total">$${total}</td>
                        </tr>
                    </tbody>
            `

            document.querySelector("#checkingoutBtn").innerHTML = `<button onclick = "checkOut()" id="checkoutBtn">CHECKOUT</button>`;
        }
    }
}
function cartReset() {
    document.querySelector("#title").style.display = "none";
    document.querySelector('#tbody').innerHTML = '<div class="  ml-2"><h1 id="empty-cart">No items in your cart!</h1><hr></div>';
    document.querySelector("thead").innerHTML =
        document.querySelector("#checkout").innerHTML = '';
    document.querySelector("#checkingoutBtn").innerHTML = '';
}

function increase(key) {
    var desiredQuantity = document.querySelector(`[data-id = input${key}]`).value * 1;
    viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    if (products[key].stock > desiredQuantity) {
        desiredQuantity++;
        document.querySelector(`[data-id = input${key}]`).value = desiredQuantity;
        cart[key].quantity += 1;
        cart[key].stock -= 1;
        cart[key].total += cart[key].price * 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        counterUpdate();
    }
}

function reduce(key) {
    var desiredQuantity = Number(document.querySelector(`[data-id = input${key}]`).value)
    if (desiredQuantity > 0) {
        if (desiredQuantity === 1) {
            delete cart[key];
            localStorage.setItem('cart', JSON.stringify(cart));
            counterUpdate();
            document.querySelector("#title").style.display = "none";
        } else {
            desiredQuantity -= 1;
            document.querySelector(`[data-id = input${key}]`).value = desiredQuantity;
            cart[key].quantity -= 1;
            cart[key].stock += 1;
            cart[key].total -= cart[key].price * 1;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    if (Object.keys(cart).length > 0) {
        displayCart();
        counterUpdate();
    } else {
        cartReset();
    }
}
function remove(key) {
    delete cart[key];
    localStorage.setItem('cart', JSON.stringify(cart));
    window.cart = JSON.parse(localStorage.getItem('cart'));
    if (Object.keys(cart).length > 0) {
        displayCart();
        counterUpdate();
    } else {
        cartReset();
        counterUpdate();
        document.querySelector("#title").style.display = "none";
    }
}

function checkOut() {
    var promises = [];
    fetch(`https://online-shop-a4050.firebaseio.com/.json`)
        .then(response => {
            if (!response.ok)
                throw Error(response.statusText);
            return response.json();
        })
        .then(response => {
            // var modified = [];
            // var deleted = [];
            window.products = response;
            var sufficientStock;
            for (key in cart) {
                if (products[key].stock >= cart[key].quantity) {
                    sufficientStock = true;
                } else {
                    sufficientStock = false;
                    break;
                }
                if (!products[key]) {
                    Swal.fire({
                        position: 'top-end',
                        type: 'info',
                        title: 'Something went wrong!',
                        text: `${cart[key].name} is no longer available and we deleted it from your cart!`,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            }
            // for (key in cart) {
            //     if (cart[key].stock > products[key].stock) {
            //         cart[key].stock = products[key].stock;
            //         modified.push(cart[key])
            //     } else if (products[key].stock === 0) {
            //         deleted.push(cart.key);
            //     }
            // }


            for (key in cart) {
                if (sufficientStock) {
                    var promise = fetch(`https://online-shop-a4050.firebaseio.com/${key}/stock/.json`, {
                        method: "PUT",
                        body: products[key].stock - cart[key].quantity,
                    });
                    promises.push(promise);
                    Promise.all(promises)
                        .then(() => {
                            Swal.fire({
                                position: 'top-end',
                                type: 'success',
                                title: 'Your order has been succesfully processed!',
                                text: "You'll soon receive a confirmation e-mail with all the order details.",
                                showConfirmButton: false,
                                timer: 3000
                            })
                                .then(() => {
                                    localStorage.clear();
                                    cartReset();
                                })
                                .then(() => {
                                    fetch(`https://online-shop-orders.firebaseio.com/.json`, {
                                        method: 'POST',
                                        body: JSON.stringify(cart),
                                        mode: 'cors'
                                    })
                                        .then(response => {
                                            if (!response.ok) {
                                                throw Error(response.statusText)
                                            }
                                            localStorage.clear();
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        })
                                })
                        })
                } else {
                    Swal.fire({
                        title: 'Something went wrong!',
                        text: `Your order couldn't be processes due to stock update! Check the cart and try again.`,
                        type: 'info',
                        showConfirmButton: false,
                        timer: 3000
                    })
                        .then(() => {
                            fetch(`https://online-shop-a4050.firebaseio.com/.json`)
                                .then(response => {
                                    if (!response.ok)
                                        throw Error(response.statusText);
                                    return response.json();
                                })
                                .then(response => window.products = response)
                                .then(() => { syncCart(); displayCart() })
                        })
                }
            }
        })
        .catch(error => {
            console.error(error);
        });


}


