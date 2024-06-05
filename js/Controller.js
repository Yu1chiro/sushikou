import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, onValue, update, get, push, set} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js"; // Added push here
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBT6BEpZ_ot9VOr7fp8ZRUcxykmBuhHXWo",
    authDomain: "sushikou-f9862.firebaseapp.com",
    databaseURL: "https://sushikou-f9862-default-rtdb.firebaseio.com",
    projectId: "sushikou-f9862",
    storageBucket: "sushikou-f9862.appspot.com",
    messagingSenderId: "424676586226",
    appId: "1:424676586226:web:783773aac7aa3612e9566b",
    measurementId: "G-5V69JWPF4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get a reference to the database here
const storage = getStorage(app); // Get a reference to the storage service here




// The rest of your code...

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('update-menu');
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            form.style.display = 'block'; // Show the form for all logged in users

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const productName = document.getElementById('product-name').value;
                const productPrice = document.getElementById('product-price').value;
                const category = document.getElementById('category').value;
                const productDesc = document.getElementById('product-desc').value;
                const productImgFile = document.getElementById('inputGroupFile04').files[0];

                if (productImgFile) {
                    // Upload image to Firebase Storage and get the URL
                    const imageRef = storageRef(storage, 'product-images/' + productImgFile.name);
                    uploadBytes(imageRef, productImgFile).then(snapshot => {
                        return getDownloadURL(snapshot.ref);
                    }).then(downloadURL => {
                        const newProduct = {
                            name: productName,
                            price: productPrice,
                            category: category,
                            description: productDesc,
                            imageUrl: downloadURL
                        };

                        // Menambahkan data baru ke database dengan id unik
                        const newRef = push(ref(database, 'products'));
                        set(newRef, newProduct).then(() => {
                            form.reset();
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Menu berhasil di upload'
                            });
                        }).catch(error => {
                            console.error('Error adding product to database:', error);
                        });
                    }).catch(error => {
                        console.error('Error uploading image:', error);
                    });
                } else {
                    const newProduct = {
                        name: productName,
                        price: productPrice,
                        category: category,
                        description: productDesc,
                        imageUrl: ''  // Default image URL if no image uploaded
                    };

                    // Menambahkan data baru ke database dengan id unik
                    const newRef = push(ref(database, 'products'));
                    set(newRef, newProduct).then(() => {
                        form.reset();
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Menu berhasil di upload'
                        });
                    }).catch(error => {
                        console.error('Error adding product to database:', error);
                    });
                }
            });
        } else {
            form.style.display = 'none';
            Swal.fire({
                icon: 'success',
                title: 'Log Out Berhasil !',
              });
        }
    });

    // Listen for changes to the products in the database
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        if (products) {
            const productsArray = Object.values(products);
            const productGrid = document.querySelector('.product');
            if (productGrid) {
                productGrid.innerHTML = '';
                productsArray.forEach(product => {
                    addProductToPage(product, productGrid); // Pass the productGrid as a parameter
                });
            } else {
                console.error('Element with id menu not found');
            }
        }
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Menu berhasil di upload'
        });
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
});


function addProductToPage(product, productGrid) { // Add productGrid as a parameter
    const productDescription = product.description.replace(/\n/g, '<br>')
    const productHtml = `
        <div class="col-sm-6 col-lg-4 all ${product.category}">
            <div class="box">
                <div>
                    <div class="img-box">
                        <img src="${product.imageUrl}" alt="${product.name}">
                    </div>
                    <div class="detail-box">
                        <h5>${product.name}</h5>
                        <p>${productDescription}</p>
                        <h6>Rp. ${product.price}</h6>
                        <button type="button" class="add-to-cart btn btn-warning fw-bold text-white" data-name="${product.name}" data-img="${product.imageUrl}" data-price="${product.price}">
                            Check Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    productGrid.insertAdjacentHTML('beforeend', productHtml); // Use the passed productGrid
}
$(window).on('load', function () {
    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    });

    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        });
    });

    // Function to add products to the page and update Isotope
    function addProductToPage(product, productGrid) {
        const productDescription = product.description.replace(/\n/g, '<br>');

        const productHtml = `
            <div class="col-sm-6 col-lg-4 all ${product.category}">
                <div class="box">
                    <div>
                        <div class="img-box">
                            <img src="${product.imageUrl}" alt="${product.name}">
                        </div>
                        <div class="detail-box">
                            <h5>${product.name}</h5>
                            <p>${productDescription}</p> <!-- Menggunakan productDescription -->
                            <h6>Rp. ${product.price}</h6>
                            <button type="button" class="add-to-cart btn btn-warning fw-bold text-white" data-name="${product.name}" data-img="${product.imageUrl}" data-price="${product.price}">
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const $productElement = $(productHtml);
        productGrid.append($productElement); // Use the passed productGrid
        $grid.isotope('appended', $productElement); // Update Isotope with the new element
    }

    // Listen for changes to the products in the database
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val();
        if (products) {
            const productsArray = Object.values(products);
            const productGrid = $('.grid'); // Use jQuery to select the grid
            if (productGrid) {
                productGrid.html(''); // Clear the grid
                productsArray.forEach(product => {
                    addProductToPage(product, productGrid); // Pass the productGrid as a parameter
                });
                $grid.isotope('layout'); // Ensure Isotope layout is updated after all items are added
            } else {
                console.error('Element with class grid not found');
            }
        }
    }).then(() => {
        console.log('Data fetched successfully');
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
});



