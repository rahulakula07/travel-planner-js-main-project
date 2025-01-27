// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Your web app's Firebase configuration
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

document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const conformPassword = document.getElementById("createpassword").value.trim();
  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value; // Get selected role

  let isValid = true;

  if (name === "") {
    document.getElementById("nameError").textContent = "Name is required";
    isValid = false;
  } else if (name.length < 3) {
    document.getElementById("nameError").textContent = "Name must be more than three characters";
    isValid = false;
  } else {
    document.getElementById("nameError").textContent = "";
  }

  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email === "") {
    document.getElementById("emailError").textContent = "Email is required";
    isValid = false;
  } else if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Invalid email";
    isValid = false;
  } else {
    document.getElementById("emailError").textContent = "";
  }

  let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (password === "") {
    document.getElementById("passwordError").textContent = "Password is required";
    isValid = false;
  } else if (!passwordPattern.test(password)) {
    document.getElementById("passwordError").textContent =
      "Password must be at least 8 characters, contain a letter, a number, and a special character.";
    isValid = false;
  } else {
    document.getElementById("passwordError").textContent = "";
  }

  if (conformPassword !== password) {
    document.getElementById("createpasswordeError").textContent = "Passwords do not match";
    isValid = false;
  } else {
    document.getElementById("createpasswordeError").textContent = "";
  }

  if (isValid) {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Realtime Database, including the role
      await set(ref(database, `users/${name}`), {
        uid:user.uid,
        name: name,
        email: email,
        role: role, // Add the selected role to the database
      });

      // Clear input fields
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("createpassword").value = "";
      document.getElementById("name").value = "";

      // Notify success and redirect
      alert(`Signup successful! Welcome, ${name}`);
      location.href = "../login/login.html";
    } catch (err) {
      console.error("Error during signup:", err.code, err.message);
      alert(`Signup failed: ${err.message}`);
    }
  }
});
