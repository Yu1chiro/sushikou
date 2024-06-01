import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
                location.href = "http://127.0.0.1:5500/login-sign.html?#";
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
            location.href = "http://127.0.0.1:5500/panel-admin.html";
        }
    } else {
        // User is signed out
        // Redirect to login page only if not already on login page
        if (!window.location.href.includes("login-sign.html?#")) {
            location.href = "http://127.0.0.1:5500/login-sign.html?#";
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
                location.href = "http://127.0.0.1:5500/login-sign.html?#";
            }
        });
    }
};

// Call checkUserExists when the page loads
checkUserExists();