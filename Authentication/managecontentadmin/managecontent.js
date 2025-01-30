// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyAShtd_GRXpbX14TX8UGpK21f6JNw89eqk",
//   authDomain: "travel-planner-f3e4f.firebaseapp.com",
//   projectId: "travel-planner-f3e4f",
//   storageBucket: "travel-planner-f3e4f.appspot.com",
//   messagingSenderId: "1080007553754",
//   appId: "1:1080007553754:web:97f9efae8223640580abe3"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const database = getDatabase(app);

// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById("tourGuideForm");
//   const errorElements = {
//     guideName: document.getElementById("guideNameError"),
//     tourLocation: document.getElementById("tourLocationError"),
//     tourDescription: document.getElementById("tourDescriptionError"),
//     chargePerDay: document.getElementById("chargePerDayError"),
//     chargePerHour: document.getElementById("chargePerHourError")
//   };

//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const formData = {
//       guideName: document.getElementById("guideName").value.trim(),
//       tourLocation: document.getElementById("tourLocation").value.trim(),
//       tourDescription: document.getElementById("tourDescription").value.trim(),
//       chargePerDay: document.getElementById("chargePerDay").value.trim(),
//       chargePerHour: document.getElementById("chargePerHour").value.trim()
//     };

//     Object.values(errorElements).forEach(element => element.textContent = '');

//     let isValid = true;
//     Object.entries(formData).forEach(([field, value]) => {
//       if (!value) {
//         errorElements[field].textContent = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
//         isValid = false;
//       }
//     });

//     if (!isValid) return;

//     try {
//       onAuthStateChanged(auth, async (adminUser) => {
//         if (!adminUser) {
//           Swal.fire("Authentication Required", "Please login as admin", "warning");
//           return;
//         }

//         const email = `${formData.guideName.replace(/\s+/g, "").toLowerCase()}@example.com`;
//         const password = "Guide@123";

//         const guideCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const guideUser = guideCredential.user;

//         const guideData = {
//           uid: guideUser.uid,
//           name: formData.guideName,
//           email: email,
//           tourLocation: formData.tourLocation,
//           tourDescription: formData.tourDescription,
//           chargePerDay: formData.chargePerDay,
//           chargePerHour: formData.chargePerHour,
//           registeredBy: adminUser.uid,
//           registrationDate: new Date().toISOString()
//         };

//         const guidesRef = ref(database, 'guides');
//         await push(guidesRef, guideData);

//         Swal.fire("Success!", "Tour guide registered", "success")
//           .then(() => window.location.href = "../admindashboard/admindashboard.html");
//       });
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//       console.error("Registration error:", error);
//     }
//   });
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAShtd_GRXpbX14TX8UGpK21f6JNw89eqk",
  authDomain: "travel-planner-f3e4f.firebaseapp.com",
  projectId: "travel-planner-f3e4f",
  storageBucket: "travel-planner-f3e4f.appspot.com",
  messagingSenderId: "1080007553754",
  appId: "1:1080007553754:web:97f9efae8223640580abe3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("tourGuideForm");
  const errorElements = {
    guideName: document.getElementById("guideNameError"),
    mainLocation: document.getElementById("mainLocationError"),
    tourPlace: document.getElementById("tourPlaceError"),
    tourDescription: document.getElementById("tourDescriptionError"),
    chargePerDay: document.getElementById("chargePerDayError"),
    chargePerHour: document.getElementById("chargePerHourError")
  };

  // Location-place mapping
  const locationPlaces = {
    "Hyderabad": ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Salar Jung Museum"],
    "Andhra Pradesh": ["Tirupati Temple", "Araku Valley", "Borra Caves", "Visakhapatnam Beach", "Kailasagiri"],
    "Goa": ["Baga Beach", "Calangute Beach", "Dudhsagar Waterfalls", "Fort Aguada", "Anjuna Flea Market"],
    "Kerala": ["Alleppey Backwaters", "Munnar Tea Gardens", "Kovalam Beach", "Periyar Wildlife Sanctuary", "Fort Kochi"],
    "Maldives": ["Male City", "Banana Reef", "Artificial Beach", "National Museum", "Hukuru Miskiy"],
    "Lakshadweep": ["Agatti Island", "Bangaram Atoll", "Kadmat Island", "Minicoy Island", "Kavaratti Island"]
  };

  // Populate places dropdown
  document.getElementById('mainLocation').addEventListener('change', function() {
    const placeSelect = document.getElementById('tourPlace');
    placeSelect.innerHTML = '';
    placeSelect.disabled = !this.value;

    if (this.value) {
      locationPlaces[this.value].forEach(place => {
        const option = document.createElement('option');
        option.value = place;
        option.textContent = place;
        placeSelect.appendChild(option);
      });
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      guideName: document.getElementById("guideName").value.trim(),
      mainLocation: document.getElementById("mainLocation").value,
      tourPlace: document.getElementById("tourPlace").value,
      tourDescription: document.getElementById("tourDescription").value.trim(),
      chargePerDay: document.getElementById("chargePerDay").value.trim(),
      chargePerHour: document.getElementById("chargePerHour").value.trim()
    };

    // Clear previous errors
    Object.values(errorElements).forEach(element => element.textContent = '');

    // Validation
    let isValid = true;
    if (!formData.guideName) {
      errorElements.guideName.textContent = "Guide name is required";
      isValid = false;
    }
    if (!formData.mainLocation) {
      errorElements.mainLocation.textContent = "Main location is required";
      isValid = false;
    }
    if (!formData.tourPlace) {
      errorElements.tourPlace.textContent = "Tourist place is required";
      isValid = false;
    }
    if (!formData.tourDescription) {
      errorElements.tourDescription.textContent = "Description is required";
      isValid = false;
    }
    if (!formData.chargePerDay) {
      errorElements.chargePerDay.textContent = "Daily charge is required";
      isValid = false;
    }
    if (!formData.chargePerHour) {
      errorElements.chargePerHour.textContent = "Hourly charge is required";
      isValid = false;
    }

    if (!isValid) return;

    try {
      onAuthStateChanged(auth, async (adminUser) => {
        if (!adminUser) {
          Swal.fire("Authentication Required", "Please login as admin", "warning");
          return;
        }

        // Prepare guide data without user creation
        const guideData = {
          name: formData.guideName,
          mainLocation: formData.mainLocation,
          tourPlace: formData.tourPlace,
          tourDescription: formData.tourDescription,
          chargePerDay: formData.chargePerDay,
          chargePerHour: formData.chargePerHour,
          registeredBy: adminUser.uid,
          registrationDate: new Date().toISOString()
        };

        // Push to Firebase
        const guidesRef = ref(database, 'guides');
        await push(guidesRef, guideData);

        Swal.fire("Success!", "Tour guide registered", "success")
          .then(() => window.location.href = "../admindashboard/admindashboard.html");
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      console.error("Registration error:", error);
    }
  });
});