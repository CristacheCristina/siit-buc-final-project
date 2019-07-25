
 document.querySelector('#backToAdmin').addEventListener('click',()=>{
    location.assign("admin.html")
});

document.querySelector('#backToShop').addEventListener('click',()=>{
    location.assign("index.html")
});

document.querySelector('#addBtn').addEventListener("click", (event) => {
    event.preventDefault();
    let category = document.querySelector('#category').value;
    let decription = document.querySelector('#description').value;
    let dose = document.querySelector('#dose').value;
    let GMO = document.querySelector('#gmo').value;
    let images = document.querySelector('#images').value;
    let name = document.querySelector('#name').value;
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector("#quantity").value;
    let totalCbd = document.querySelector('#totalCbd').value;
    let stock = document.querySelector('#stock').value;
    
    if (category !== '' &&
        decription !== '' &&
        dose !== '' &&
        GMO !== '' &&
        images !== '' &&
        name !== '' &&
        price !== '' &&
        quantity !== '' &&
        totalCbd !== ''&&
        stock!=='') {
        product = {
            category: category,
            decription: decription,
            dose: dose,
            GMO: GMO,
            images: images,
            name: name,
            price: price,
            quantity:quantity,
            totalCbd: totalCbd,
            stock: stock
            
        }

        document.body.style.height = "100vh"
        document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
        document.body.style.backgroundPosition = "50% 50%";
        fetch("https://online-shop-a4050.firebaseio.com/.json", {
            method: "POST",
            body: JSON.stringify(product),
            mode: "cors"
        })
            .then(response => { if (!response.ok) { throw Error(response.statusText) } })
            .then(() => {
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'The product has been added to DB!',
                    showConfirmButton: false,
                    timer: 2000
                })
                    .then(() => location.assign("admin.html"))
            })
            .catch(err => console.error(err));
    }
    else {
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Fields cannot be empty, check your input and try again!',
            showConfirmButton: false,
            timer: 2000
        })
    }
})
