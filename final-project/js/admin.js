window.onload = () => {
    document.body.style.height = "100vh";
    document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
    document.body.style.backgroundPosition = "50% 50%";
    fetch(`https://online-shop-a4050.firebaseio.com/.json`)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            } else if (response.ok && response.status === 200) {
                return response.json();
            }
        })
        .then(response => {
            window.products = response;
            document.body.style.height = '';
            document.body.style.background = '';
            document.body.style.backgroundPosition = '';
            display(response);
        })
}

function display(obj) {
    document.querySelector("#items").innerHTML = '';
    document.querySelector("thead").innerHTML = `
                <tr>
                    <th class="d-none d-sm-none d-md-block">Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th></th>
                    <th></th>
                </tr>
            `
    document.querySelector('#backToShop').addEventListener('click', () => {
        location.assign("index.html")
    });

    document.querySelector('#adminAdd').addEventListener('click', () => {
        location.assign("add.html")
    })
    
    for (key in obj)
        document.querySelector("#items").innerHTML += `
                <tr>
                    <td class="d-none d-sm-none d-md-block"><img src = "${obj[key].image}"></td>
                    <td>${obj[key].name}</td>
                    <td>${obj[key].price}</td>
                    <td>${obj[key].stock}</td>
                    <td><button class="editBtn" id = "edit${key}" onclick = "edit('${key}')">Edit</button></td>
                    <td><button class="deleteBtn" id = "delete${key}" onclick = "remove('${key}')" >Delete</button></td>
                </tr>
                `
}

async function remove(key) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            fetch(`https://online-shop-a4050.firebaseio.com/${key}.json`, {
                method: 'DELETE',
                mode: 'cors'
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText)
                    }
                })
                .then(() => {
                    Swal.fire({
                        position: 'center',
                        type: 'success',
                        title: 'The product has been deleted from DB!',
                        showConfirmButton: false,
                        timer: 2000
                    })
                        .then(() => {
                            document.querySelector("#items").innerHTML = '';
                            document.querySelector("thead").innerHTML = '';
                            document.body.style.height = "100vh"
                            document.body.style.background = 'url("https://www.seedsmancbd.com/media/productfinder/loading.gif") no-repeat';
                            document.body.style.backgroundPosition = "50% 50%";
                            fetch(`https://online-shop-a4050.firebaseio.com/.json`)
                                .then(response => {
                                    if (!response.ok) throw Error(response.statusText);
                                    return response.json();
                                })
                                .then(response => {
                                    document.body.style.height = '';
                                    document.body.style.background = '';
                                    document.body.style.backgroundPosition = '';
                                    display(response)
                                })
                                .catch(err => console.error(err))
                        })
                })
                .catch(error => console.error(error))



        }
    })

}

function edit(key) {
    window.location.assign(`edit.html?id=${key}`)
};
