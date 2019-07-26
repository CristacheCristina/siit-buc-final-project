let url = new URL(document.URL);
let key = url.searchParams.get('id');
window.onload = () => {
    document.querySelector("#form").style.display = "none";
    document.body.style.height = "100vh"
    document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
    document.body.style.backgroundPosition = "50% 50%";

    document.querySelector('#backToAdmin').addEventListener('click', () => {
        location.assign("admin.html")
    });

    document.querySelector('#backToShop').addEventListener('click', () => {
        location.assign("index.html")
    });
    try {
        var data = await fetch(`https://online-shop-a4050.firebaseio.com/${key}.json`)
        var response = await data.json();
    } catch (error) {
        console.error(error);

    }
    document.querySelector("#form").style.display = "block";
    document.body.style.height = ""
    document.body.style.background = '';
    document.body.style.backgroundPosition = "";
    document.querySelector('#category').value = response.category;
    document.querySelector("#description").value = response.description;
    document.querySelector("#dose").value = response.dose;
    document.querySelector("#gmo").value = response.GMO;
    document.querySelector("#images").value = response.images;
    document.querySelector("#name").value = response.name;
    document.querySelector("#price").value = response.price;
    document.querySelector("#quantity").value = response.quantity;
    document.querySelector("#totalCbd").value = response.totalCbd;
    document.querySelector("#stock").value = response.stock;
    document.querySelector("#saveChanges").addEventListener("click", updateDB)
}

async function updateDB(event) {
    event.preventDefault();
    let category = document.querySelector('#category').value;
    let decription = document.querySelector('#description').value;
    let dose = document.querySelector('#dose').value;
    let gmo = document.querySelector('#gmo').value;
    let images = document.querySelector('#images').value;
    let name = document.querySelector('#name').value;
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector("#quantity").value;
    let totalCbd = document.querySelector('#totalCbd').value;
    let stock = document.querySelector('#stock').value;

    if (category !== '' &&
        decription !== '' &&
        dose !== '' &&
        gmo !== '' &&
        images !== '' &&

        name !== '' &&
        price !== '' &&
        quantity !== '' &&
        totalCbd !== '' &&
        stock !== '') {
        let edited = {
            category: category,
            decription: description,
            dose: dose,
            GMO: gmo,
            images: images,
            name: name,
            price: price,
            quantity: quantity,
            totalCbd: totalCbd,
            stock: stock * 1
        }
        try {
            let edit = await fetch(`https://online-shop-a4050.firebaseio.com/${key}.json`, {
                method: "PUT",
                body: JSON.stringify(edited),
                mode: "cors"
            })
        } catch (error) {
            console.error();
        }
        Swal.fire({
            position: 'center',
            type: 'success',
            title: 'The product has been succesfully updated!',
            showConfirmButton: false,
            timer: 2000
        })
            .then(() => location.assign("admin.html"))
 
            .catch(err => console.error(err))
    } else {
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Property cannot be empty, check your input and try again!',
            showConfirmButton: false,
            timer: 2000
        })
    }
}
