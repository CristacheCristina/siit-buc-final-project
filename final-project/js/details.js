(() => {
    var url = new URL(document.URL);
    var id = url.searchParams.get('id');


    window.onload = () => {
        alertify.defaults.transition = "slide";
        alertify.defaults.theme.ok = "btn btn-primary";
        alertify.defaults.theme.cancel = "btn btn-danger";
        alertify.defaults.theme.input = "form-control";
        alertify.defaults.glossary.title = '';
        // alertify.defaults = {
        //     glossary: {
        //         // dialogs default title
        //         title: 'AlertifyJS',
        //         // ok button text
        //         ok: 'OK',
        //         // cancel button text
        //         cancel: 'Cancel'
        //     }
        // }
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

        getAndDisplay();
    }

    async function getAndDisplay() {
        try {
            let data = await fetch(`https://online-shop-a4050.firebaseio.com/${id}.json`);
            console.log(data);
            window.detailedProduct = await data.json();
            loader();
            displayDetails(detailedProduct);
            $('.carousel').carousel();
            counterUpdate();
        } catch (error) { console.error(error) }
    }
    function loader() {
        if (document.body.hasAttribute("load")) {
            document.body.removeAttribute("load");
            document.body.setAttribute("loaded", "true");
            document.body.style.height = "100vh"
            document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
            document.body.style.backgroundPosition = "50% 50%";

        } else {
            document.body.removeAttribute("loaded");
            document.body.setAttribute("load", "true");
            document.body.style.height = '';
            document.body.style.background = '';
            document.body.style.backgroundPosition = "";
        }
    }
    function counterUpdate() {
        var cart = cartInit();
        var counter = 0;
        if (cart) {
            for (key in cart) {
                counter += cart[key].quantity;
            }
        }
        document.querySelector("#counter").innerHTML = counter;
    }

    function displayDetails(obj) {
        console.log(detailedProduct);
        var images = detailedProduct.images.split(" ");
        var details = detailedProduct.description.split(/\n/);
        var newDetails = details.map(function (elem) {
            return `<i class="fas fa-check ml-2" style="float:left"></i><p>${elem}</p>`;
        }).join('');

        document.querySelector(".mainSection").innerHTML = `  
        <div class="row">
         <div class="col-11 col-sm-11 col-md-6 col-lg-6 col-xl-5 image details-box mx-auto">
            <div id="carouselExampleIndicators" class="carousel custom slide" data-ride="carousel">
              <ol class="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              </ol>
              <div class="carousel-inner">
                <div data-interval="3000" class="carousel-item active">
                  <img class="d-block w-100 img-fluid" src="../images/${images[0]}" alt="First  slide">
                </div>
                <div data-interval="3000" class="carousel-item">
                  <img class="d-block w-100 img-fluid" src="../images/${images[1]}" alt="Second     slide">
                </div>
        
              </div>
              <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button"  data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleIndicators" role="button"  data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
        
        </div>
    
     <div class="col-11 col-sm-11 col-md-6 col-lg-6 col-xl-6 details-box text-details mx-auto">
         <h2 id = "product-name" class="ml-2">${obj.name}</h2>
         <div class= "price ml-2" ><p >$${obj.price.toFixed(2)}</p></div>
         <div class="my-4" id = "description">${newDetails}</div>
         <div id = "stock" class="ml-2"><span style="font-weight:600">Stock:</span> ${obj.stock}</div>
         <div id="addBtnsGroup" class="my-3 ml-2"><i class = "fas fa-arrow-circle-left fa-lg" id = "decrement"></i><input type = "text" value = 1  id = "quantity"><i class = "fas fa-arrow-circle-right fa-lg" id = "increment"></i><button id = "addToCart">Add to cart</button></div>
         <div class="row details ">
             <div class="col-4 col-sm-4 col-md-4 col-md-4 col-lg-4 facts-border">
                 <div class = "facts">
                    <p>Size/ Quantity</p>
                    <p>${obj.quantity}</p>
                 </div>
             </div>
             <div class="col-4 col-sm-4 col-md-4 col-md-4 col-lg-4 facts-border">
                <div class = "facts">
                   <p>Fact</p>
                   <p>${obj.GMO === "true" ? "GMO" : "Non-GMO"}</p>
                </div>
             </div>
             <div class="col-4 col-sm-4 col-md-4 col-md-4 col-lg-4 facts-border ">
                <div class = "facts">
                   <p>Dose</p>
                    <p>${obj.dose}</p>
                </div>
             </div>
             <div class = "row">
                <h3 id = "outOfStock"></h2> 
             </div>
             
         </div>
     </div>
    </div>
    `;

        document.querySelector('#addToCart').onmouseover = () => {
            if (detailedProduct.stock === 0) {
                document.querySelector("#addToCart").style.transitionDuration = "2000"
                document.querySelector("#addToCart").innerHTML = '';
                document.querySelector("#addToCart").innerHTML = "Out of stock"
            }

        }

        document.querySelector('#addToCart').onmouseout = () => {
            if (detailedProduct.stock === 0) {
                document.querySelector("#addToCart").innerHTML = '';
                document.querySelector("#addToCart").innerHTML = "Add to cart"
            }

        }


        document.querySelector("#decrement").addEventListener("click", () => {
            if (parseInt(document.getElementById('quantity').value, 10) > 1)
                document.getElementById('quantity').value -= 1;


        });

        document.querySelector("#increment").addEventListener("click", () => {
            var cart = cartInit();
            var desiredQuantity = Number(document.querySelector("#quantity").value);
            let value = parseInt(document.getElementById('quantity').value, 10);
            if (cart[id]) {
                if ((detailedProduct.stock - cart[id].quantity) > 0) {
                    if (desiredQuantity <= detailedProduct.stock - cart[id].quantity) {
                        value = isNaN(value) ? 0 : value;
                        value++;
                        document.getElementById('quantity').value = value;
                    }
                } else {
                    console.log(cart);
                    console.log(cart[id].quantity);
                    console.log(id);
                    Swal.fire({
                        type: 'error',
                        title: `The required quantity exceeds our stock! ${cart[id].quantity} items of this product are already in your cart.`,
                    })
                    // alertify.dialog('alert').set({ transition: 'zoom', message: `The required quantity exceeds our stock! ${cart[id].quantity} items of this product are already in your cart.` }).set('closable',false).show();
                    // alertify.alert('Ready!');


                }
            } else if (desiredQuantity < detailedProduct.stock) {
                value = isNaN(value) ? 0 : value;
                value++;
                document.getElementById('quantity').value = value;
            }

        });

        document.querySelector("#addToCart").addEventListener("click", () => {
            cartInit();
            addToCart()
        });

    }

    function cartInit() {
        var cart;
        if (localStorage.length > 0)
            cart = JSON.parse(localStorage.getItem('cart'));
        else
            cart = {}
        return cart;
    }

    function addToCart() {
        var cart = cartInit();
        var desiredQuantity = Number(document.querySelector("#quantity").value);
        if (desiredQuantity > 0) {
            if (cart[id]) {
                if (desiredQuantity > cart[id].stock) {
                    if (cart[id].stock > 0) {
                        Swal.fire({
                            type: 'error',
                            title: 'The required quantity exceeds our stock!',
                        })
                    } else {
                        Swal.fire({
                            type: 'error',
                            title: 'This item is out of stock!',
                        })
                    }
                } else {
                    cart[id].quantity += desiredQuantity;
                    cart[id].stock -= desiredQuantity;
                    cart[id].total += (cart[id].price * 1) * desiredQuantity
                    localStorage.setItem('cart', JSON.stringify(cart));
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Added to cart!',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    document.querySelector("#quantity").value = 0;
                    counterUpdate();
                    popperCart();
                }
            } else {
                if (desiredQuantity > detailedProduct.stock) {
                    if (detailedProduct.stock > 0) {
                        Swal.fire({
                            type: 'error',
                            title: 'The required quantity exceeds our stock!',
                        })
                    } else {
                        Swal.fire({
                            type: 'error',
                            title: 'This item is out of stock!',
                        })
                    }
                } else {
                    cart[id] = {
                        images: detailedProduct.images,
                        name: detailedProduct.name,
                        price: detailedProduct.price,
                        stock: detailedProduct.stock - desiredQuantity,
                        quantity: desiredQuantity,
                        total: detailedProduct.price * 1
                    };

                    localStorage.setItem('cart', JSON.stringify(cart));
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Added to cart!',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    document.querySelector("#quantity").value = 0;
                    counterUpdate();

                }
            }
        } else {
            Swal.fire({
                position: 'top-end',
                type: 'error',
                title: 'You need to add al teals 1 item!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
})()