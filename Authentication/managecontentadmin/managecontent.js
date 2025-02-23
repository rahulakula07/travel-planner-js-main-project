// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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

// document.addEventListener('DOMContentLoaded', async () => {
//   const form = document.getElementById("tourGuideForm");
//   const guideDetailsContainer = document.getElementById("guideDetails");

//   const errorElements = {
//     guideName: document.getElementById("guideNameError"),
//     mainLocation: document.getElementById("mainLocationError"),
//     tourPlace: document.getElementById("tourPlaceError"),
//     tourDescription: document.getElementById("tourDescriptionError"),
//     chargePerDay: document.getElementById("chargePerDayError"),
//     chargePerHour: document.getElementById("chargePerHourError")
//   };

//   // Location-place mapping
//   const locationPlaces = {
//     "Hyderabad": ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Salar Jung Museum"],
//     "Andhra Pradesh": ["Tirupati Temple", "Araku Valley", "Borra Caves", "Visakhapatnam Beach", "Kailasagiri"],
//     "Goa": ["Baga Beach", "Calangute Beach", "Dudhsagar Waterfalls", "Fort Aguada", "Anjuna Flea Market"],
//     "Kerala": ["Alleppey Backwaters", "Munnar Tea Gardens", "Kovalam Beach", "Periyar Wildlife Sanctuary", "Fort Kochi"],
//     "Maldives": ["Male City", "Banana Reef", "Artificial Beach", "National Museum", "Hukuru Miskiy"],
//     "Lakshadweep": ["Agatti Island", "Bangaram Atoll", "Kadmat Island", "Minicoy Island", "Kavaratti Island"]
//   };

//   // Populate places dropdown
//   document.getElementById('mainLocation').addEventListener('change', function() {
//     const placeSelect = document.getElementById('tourPlace');
//     placeSelect.innerHTML = '';
//     placeSelect.disabled = !this.value;

//     if (this.value) {
//       locationPlaces[this.value].forEach(place => {
//         const option = document.createElement('option');
//         option.value = place;
//         option.textContent = place;
//         placeSelect.appendChild(option);
//       });
//     }
//   });

//   // Handle guide form submission
//   if (form) {
//     form.addEventListener("submit", async (event) => {
//       event.preventDefault();

//       const formData = {
//         guideName: document.getElementById("guideName").value.trim(),
//         mainLocation: document.getElementById("mainLocation").value,
//         tourPlace: document.getElementById("tourPlace").value,
//         tourDescription: document.getElementById("tourDescription").value.trim(),
//         chargePerDay: document.getElementById("chargePerDay").value.trim(),
//         chargePerHour: document.getElementById("chargePerHour").value.trim()
//       };

//       // Clear previous errors
//       Object.values(errorElements).forEach(element => element.textContent = '');

//       // Validation
//       let isValid = true;
//       if (!formData.guideName) {
//         errorElements.guideName.textContent = "Guide name is required";
//         isValid = false;
//       }
//       if (!formData.mainLocation) {
//         errorElements.mainLocation.textContent = "Main location is required";
//         isValid = false;
//       }
//       if (!formData.tourPlace) {
//         errorElements.tourPlace.textContent = "Tourist place is required";
//         isValid = false;
//       }
//       if (!formData.tourDescription) {
//         errorElements.tourDescription.textContent = "Description is required";
//         isValid = false;
//       }
//       if (!formData.chargePerDay) {
//         errorElements.chargePerDay.textContent = "Daily charge is required";
//         isValid = false;
//       }
//       if (!formData.chargePerHour) {
//         errorElements.chargePerHour.textContent = "Hourly charge is required";
//         isValid = false;
//       }

//       if (!isValid) return;

//       try {
//         onAuthStateChanged(auth, async (adminUser) => {
//           if (!adminUser) {
//             Swal.fire("Authentication Required", "Please login as admin", "warning");
//             return;
//           }

//           const guideData = {
//             name: formData.guideName,
//             mainLocation: formData.mainLocation,
//             tourPlace: formData.tourPlace,
//             tourDescription: formData.tourDescription,
//             chargePerDay: formData.chargePerDay,
//             chargePerHour: formData.chargePerHour,
//             registeredBy: adminUser.uid,
//             registrationDate: new Date().toISOString()
//           };

//           const guidesRef = ref(database, 'guides');
//           await push(guidesRef, guideData);

//           Swal.fire("Success!", "Tour guide registered", "success")
//             .then(() => window.location.href = "../admindashboard/admindashboard.html");
//         });
//       } catch (error) {
//         Swal.fire("Error", error.message, "error");
//         console.error("Registration error:", error);
//       }
//     });
//   }

//   // Fetch and filter guides
//   const guidesRef = ref(database, "guides");
//   const bookingsRef = ref(database, "userBookings");

//   try {
//     const guidesSnapshot = await get(guidesRef);
//     const bookingsSnapshot = await get(bookingsRef);

//     const guides = guidesSnapshot.exists() ? guidesSnapshot.val() : {};
//     const userBookings = bookingsSnapshot.exists() ? bookingsSnapshot.val() : {};

//     console.log("Fetched Guides:", guides);
//     console.log("Fetched User Bookings:", userBookings);

//     // Extract unique places and states from user bookings
//     const userPlaces = new Set(Object.values(userBookings).map(booking => booking.place));
//     const userStates = new Set(Object.values(userBookings).map(booking => booking.state));

//     // Filter guides based on tourPlace and mainLocation
//     const matchingGuides = Object.values(guides).filter(guide =>
//       userPlaces.has(guide.tourPlace) && userStates.has(guide.mainLocation)
//     );

//     console.log("Matching Guides:", matchingGuides);

//     // Display matched guides
//     if (guideDetailsContainer) {
//       guideDetailsContainer.innerHTML = matchingGuides.length > 0
//         ? matchingGuides.map(guide => `
//             <div class="guide-card">
//                 <h2>${guide.name || "Unknown Guide"}</h2>
//                 <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
//                 <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
//                 <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
//                 <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
//                 <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
//             </div>
//           `).join('')
//         : "<p>No matching guides found.</p>";
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     guideDetailsContainer.innerHTML = "<p>Error loading guide details.</p>";
//   }
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
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

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById("tourGuideForm");
  const guideDetailsContainer = document.getElementById("guideDetails");

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

  // Handle guide form submission
  if (form) {
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
  }

  // Fetch and filter guides
  const guidesRef = ref(database, "guides");
  const bookingsRef = ref(database, "userBookings");

  try {
    const guidesSnapshot = await get(guidesRef);
    const bookingsSnapshot = await get(bookingsRef);

    const guides = guidesSnapshot.exists() ? guidesSnapshot.val() : {};
    const userBookings = bookingsSnapshot.exists() ? bookingsSnapshot.val() : {};

    console.log("Fetched Guides:", guides);
    console.log("Fetched User Bookings:", userBookings);

    // Extract unique places from user bookings
    const userPlaces = new Set(Object.values(userBookings).map(booking => booking.place));

    // Filter guides based on tourPlace
    const matchingGuides = Object.values(guides).filter(guide =>
      userPlaces.has(guide.tourPlace) // Ensures only guides whose `tourPlace` matches a `place` in bookings are included
    );

    console.log("Matching Guides:", matchingGuides);

    // Display matched guides
    if (guideDetailsContainer) {
      guideDetailsContainer.innerHTML = matchingGuides.length > 0
        ? matchingGuides.map(guide => `
          <div class="guide-card">
              <h2>${guide.name || "Unknown Guide"}</h2>
              <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
              <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
              <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
              <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
              <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
          </div>
        `).join('')
        : "<p>No matching guides found.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    guideDetailsContainer.innerHTML = "<p>Error loading guide details.</p>";
  }
});
