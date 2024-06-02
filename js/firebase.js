// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

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
          alert("User telah sukses dibuat");
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

      user.getIdTokenResult().then((idTokenResult) => {
        // Check if user has admin claim
        if (!!idTokenResult.claims.admin) {
          // Update last login time
          let lgDate = new Date();
          update(ref(database, "admin/" + user.uid), {
            last_login: lgDate
          })
          .then(() => {
            // Data saved successfully
            location.href = "https://sushikou.vercel.app/panel-admin.html";
          })
          .catch((error) => {
            // The write failed
            alert(error);
          });
        } else {
          alert("Access Denied. Admins only.");
        }
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  
  signOut(auth)
    .then(() => {})
    .catch((error) => {});
});
