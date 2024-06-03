// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

let signinButton = document.getElementById("signin-button");
let signupButton = document.getElementById("signup-button");

signupButton.addEventListener("click", (e) => {
  let name = document.getElementById("name").value;
  let nohp = document.getElementById("nohp").value;
  let emailSignup = document.getElementById("email_signup").value;
  let passwordSignup = document.getElementById("psw_signup").value;

  createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      set(ref(database, "admin/" + user.uid), {
        name: name,
        nohp: nohp,
        email: emailSignup,
        password: passwordSignup,
        admin: true // Set admin flag to true
      })
        .then(() => {
          // Data saved successfully!
          alert("Admin telah sukses dibuat");
        })
        .catch((error) => {
          // The write failed
          alert(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

signinButton.addEventListener("click", (e) => {
  let emailSignin = document.getElementById("email_signin").value;
  let passwordSignin = document.getElementById("psw_signin").value;

  signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // Check if user is admin from database
      const dbRef = ref(database);
      get(child(dbRef, `admin/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().admin === true) {
          // Update last login time
          let lgDate = new Date();
          update(ref(database, "admin/" + user.uid), {
            last_login: lgDate
          })
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Welcome Back Admin👋',
            }).then(() => {
              // Redirect after the alert is closed
              // location.href = "http://127.0.0.1:5500/panel-admin.html";
              location.href = "https://sushikou.vercel.app/panel-admin.html";
            });
          })
          .catch((error) => {
            // The write failed
            alert(error);
          });
        } else {
          alert("Access Denied. Admins only.");
          signOut(auth).catch((error) => console.log("Sign out error:", error));
        }
      }).catch((error) => {
        console.error(error);
        alert("Failed to check admin status.");
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Oops! Email & Password Salah'
      });
    });
});
