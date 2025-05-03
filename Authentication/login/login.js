
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


document.getElementById("loginSubmitBtn").addEventListener("click", async (event) => {
  event.preventDefault();


  const loginEmail = document.getElementById("email").value.trim();
  const loginPassword = document.getElementById("password").value.trim();

  try {

    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait while we log you in.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false
    });


    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    const user = userCredential.user;
    const usersRef = ref(database, 'users');
    
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      let foundUser = null;

      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.email === loginEmail) {
          foundUser = userData;
        }
      });

      if (foundUser) {
        const role = foundUser.role;
        Swal.close();

        if (role === "admin") {
          location.href = "../admindashboard/admindashboard.html"; 
        } else if (role === "user") {
          location.href = "../userloginpage/userloginpage.html"; 
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Role Not Defined',
            text: 'Please contact support.',
            showConfirmButton: true
          });
        }
      } else {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'User Not Found',
          text: 'No user data found. Please contact support.',
          showConfirmButton: true
        });
      }
    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'No User Data Found',
        text: 'Please contact support.',
        showConfirmButton: true
      });
    }
  } catch (err) {

    Swal.close();

    console.error("Error during login:", err.code, err.message);
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: `Login failed: ${err.message}`,
      showConfirmButton: true
    });
  }
});

const guestCredentials = {
  user: {
    email: "user@gmail.com",
    password: "User@123"
  },
  admin: {
    email: "admin@gmail.com",
    password: "Admin@123"
  }
};


document.getElementById("guestUserBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("email").value = guestCredentials.user.email;
  document.getElementById("password").value = guestCredentials.user.password;
  document.getElementById("loginSubmitBtn").click();
});


document.getElementById("guestAdminBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("email").value = guestCredentials.admin.email;
  document.getElementById("password").value = guestCredentials.admin.password;
  document.getElementById("loginSubmitBtn").click();
});

