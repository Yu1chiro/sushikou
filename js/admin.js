import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, onValue, update, get } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
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

// Function to create a table row
function createTableRow(data, id) {
    return `
        <tr data-id="${id}">
            <td class="text-center">${data.name}</td>
            <td class="text-center">${data.pesan}</td>
            <td class="text-center">${data.totalPrice}</td>
            <td class="text-center">${data.whatsapp}</td>
            <td class="text-center">${data.cartItems.map(item => `${item.productName} (${item.quantity})`).join(', ')}</td>
            <td class="payment-status fw-bold text-center">${data.Paymentstatus}</td>
            <td class="text-center"><button type="button" class="btn-update btn btn-sm btn-success">Update ✅</button></td>
        </tr>
    `;
}
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

// Get reference to the orders in the database
const ordersRef = ref(database, 'customer-order');

// Listen for changes in the data
onValue(ordersRef, (snapshot) => {
    const orders = snapshot.val();
    const tableBody = document.getElementById('orders-table-body');
    tableBody.innerHTML = ''; // Clear table body
    for (const id in orders) {
        const order = orders[id];
        tableBody.innerHTML += createTableRow(order, id);
    }

    // Attach click event listeners to the update buttons
    const updateButtons = document.querySelectorAll('.btn-update');
    updateButtons.forEach(button => {
        button.addEventListener('click', handleUpdateButtonClick);
    });
});


// Function to handle update button click
function handleUpdateButtonClick(event) {
    const style = document.createElement('style');
style.innerHTML = `
    .payment-success {
        color: green;
        font-weight: bold;
    }
`;
document.head.appendChild(style);
    const row = event.target.closest('tr');
    const orderId = row.getAttribute('data-id');
    const paymentStatusCell = row.querySelector('.payment-status');

    if (paymentStatusCell.textContent === 'Pending') {
        // Update the payment status in the database
        const orderRef = ref(database, `customer-order/${orderId}`);
        update(orderRef, {
            Paymentstatus: 'Success'
        }).then(() => {
            // Update the payment status in the UI
            paymentStatusCell.textContent = 'Success';
            paymentStatusCell.classList.add('payment-success'); // Apply the CSS class
        }).catch(error => {
            console.error('Error updating payment status:', error);
        });
    }
}
let logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", (e) => {
    const auth = getAuth(app);
    signOut(auth)
        .then(() => {
            // Menggunakan SweetAlert2
            Swal.fire({
                title: 'Logout successful',
                icon: 'success',
                timer: 5000,  // Set timer to 1 second
                showConfirmButton: false
            }).then(() => {
                // Redirect setelah timer selesai
                // location.href = "http://127.0.0.1:5500/login-sign.html?#";
                location.href = "https://sushikou.vercel.app/login-sign.html?#";
            });
        })
        .catch((error) => {
            console.error('Sign out error', error);
        });
});

// Check if user is authenticated
onAuthStateChanged(getAuth(app), (user) => {
    if (user) {
        // User is signed in
        // Redirect to admin panel only if not already on admin panel
        if (!window.location.href.includes("panel-admin.html")) {
            // location.href = "http://127.0.0.1:5500/panel.html";
            location.href = "https://sushikou.vercel.app/panel-admin.html";
        }
    } else {
        // User is signed out
        // Redirect to login page only if not already on login page
        if (!window.location.href.includes("login-sign.html?#")) {
            // location.href = "http://127.0.0.1:5500/login-sign.html?#";
            location.href = "https://sushikou.vercel.app/login-sign.html?#";
        }
    }
});

// Check if user exists in database
const checkUserExists = () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
        // User is signed in
        const uid = user.uid;
        const usersRef = ref(database, 'admin/' + uid);
        onValue(usersRef, (snapshot) => {
            const userData = snapshot.val();
            if (!userData) {
                // User does not exist in database
                // Redirect to login page
                // location.href = "http://127.0.0.1:5500/login-sign.html?#";
                location.href = "https://sushikou.vercel.app/login-sign.html?#";
            }
        });
    }
};

// Call checkUserExists when the page loads
checkUserExists();
// 




