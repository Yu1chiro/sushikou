import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
const database = getDatabase(app);

document.querySelector('.submit-data').addEventListener('click', function() {
    var name = document.querySelector('input[name="name-customer"]').value;
    var whatsapp = document.querySelector('input[name="whatsapp"]').value;
    var pesan = document.querySelector('input[name="pesan"]').value;

    var cartItems = [];
    document.querySelectorAll('.cart-items .cart-item').forEach(function(item) {
        var productName = item.dataset.name;
        var productPrice = parseInt(item.querySelector('.product-price').textContent);
        var quantity = parseInt(item.querySelector('.quantity').textContent);

        cartItems.push({
            productName: productName,
            productPrice: productPrice,
            quantity: quantity
        });
    });

    var totalPrice = 0;
    document.querySelectorAll('.cart-items .cart-item').forEach(function(item) {
        var productPrice = parseInt(item.querySelector('.product-price').textContent);
        var quantity = parseInt(item.querySelector('.quantity').textContent);
        totalPrice += productPrice * quantity;
    });

    // Kirim data ke Firebase
    var newDataRef = push(ref(database, 'checkouts'));
    set(newDataRef, {
        name: name,
        whatsapp: whatsapp,
        pesan: pesan,
        cartItems: cartItems,
        totalPrice: totalPrice
    });

    // Reset formulir dan keranjang setelah checkout
    document.querySelector('input[name="name-customer"]').value = '';
    document.querySelector('input[name="whatsapp"]').value = '';
    document.querySelector('input[name="pesan"]').value = '';
    document.querySelector('.cart-items').innerHTML = '';
    document.querySelector('.total-price').textContent = 'Total: Rp. 0';
});
