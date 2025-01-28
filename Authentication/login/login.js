// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAShtd_GRXpbX14TX8UGpK21f6JNw89eqk",
  authDomain: "travel-planner-f3e4f.firebaseapp.com",
  projectId: "travel-planner-f3e4f",
  storageBucket: "travel-planner-f3e4f.appspot.com",
  messagingSenderId: "1080007553754",
  appId: "1:1080007553754:web:97f9efae8223640580abe3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Login button click event
document.getElementById("loginSubmitBtn").addEventListener("click", async (event) => {
  event.preventDefault();

  // Get email and password from the form
  const loginEmail = document.querySelector("input[type='email']").value.trim();
  const loginPassword = document.querySelector("input[type='password']").value.trim();

  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    const user = userCredential.user;

    // Get a reference to the users node
    const usersRef = ref(database, 'users');
    
    // Get all users data
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      let foundUser = null;

      // Iterate through users to find the one with the matching email
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.email === loginEmail) {
          foundUser = userData; // Store the found user
        }
      });

      // Check if user was found
      if (foundUser) {
        const role = foundUser.role; // Get the role of the found user

        // Redirect based on role
        if (role === "admin") {
          location.href = "../admindashboard/admindashboard.html"; // Admin dashboard
        } else if (role === "user") {
          location.href = "../userdashboard/userdashboard.html"; // User dashboard
        } else {
          alert("Role not defined. Please contact support.");
        }
      } else {
        alert("No user data found. Please contact support.");
      }
    } else {
      alert("No user data found. Please contact support.");
    }
  } catch (err) {
    console.error("Error during login:", err.code, err.message);
    alert(`Login failed: ${err.message}`);
  }
});
