import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getDatabase, get } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
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
function exportToExcel(data) {
    const worksheetData = data.map(order => ({
        Name: order.name,
        Pesan: order.pesan,
        TotalPrice: order.totalPrice,
        WhatsApp: order.whatsapp,
        CartItems: order.cartItems.map(item => `${item.productName} (${item.quantity})`).join(', '),
        PaymentStatus: order.Paymentstatus
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Data-Order.xlsx");
}

// Add event listener to the "Extract to excel" button
document.querySelector('.btn-ex').addEventListener('click', () => {
    get(ordersRef).then((snapshot) => {
        const orders = [];
        snapshot.forEach((childSnapshot) => {
            orders.push(childSnapshot.val());
        });

        exportToExcel(orders);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
});