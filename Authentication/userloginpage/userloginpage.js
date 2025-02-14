let searchbtn = document.querySelector("#search-btn");
let searchbar = document.querySelector(".search-bar-container");
let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");
let videobtn = document.querySelectorAll(".vid-btn");

window.onscroll = () => {
  searchbtn.classList.remove("fa-times");
  searchbar.classList.remove("active");
  menu.classList.remove("fa-times");
  navbar.classList.remove("active");
};

searchbtn.addEventListener("click", () => {
  searchbtn.classList.toggle("fa-times");
  searchbar.classList.toggle("active");
});

menu.addEventListener("click", () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});

videobtn.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector('.controls .active')?.classList.remove('active');
    btn.classList.add('active');

    let src = btn.getAttribute('data-src');
    document.querySelector('#video-slider').src = src;
  });
});

var swiper = new Swiper(".review-slider", {
  spaceBetween: 20,
  loop: true,
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
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

// Location-Places Mapping
const locationPlaces = {
  "Hyderabad": ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Salar Jung Museum"],
  "Andhra Pradesh": ["Tirupati Temple", "Araku Valley", "Borra Caves", "Visakhapatnam Beach", "Kailasagiri"],
  "Goa": ["Baga Beach", "Calangute Beach", "Dudhsagar Waterfalls", "Fort Aguada", "Anjuna Flea Market"],
  "Kerala": ["Alleppey Backwaters", "Munnar Tea Gardens", "Kovalam Beach", "Periyar Wildlife Sanctuary", "Fort Kochi"],
  "Maldives": ["Male City", "Banana Reef", "Artificial Beach", "National Museum", "Hukuru Miskiy"],
  "Lakshadweep": ["Agatti Island", "Bangaram Atoll", "Kadmat Island", "Minicoy Island", "Kavaratti Island"]
};

// Populate state dropdown
const stateSelect = document.getElementById("state");
const placeSelect = document.getElementById("place");

Object.keys(locationPlaces).forEach(state => {
  const option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  stateSelect.appendChild(option);
});

stateSelect.addEventListener("change", function () {
  placeSelect.innerHTML = '<option value="">Select Place</option>';
  placeSelect.disabled = !this.value;
  if (this.value) {
    locationPlaces[this.value].forEach(place => {
      const option = document.createElement("option");
      option.value = place;
      option.textContent = place;
      placeSelect.appendChild(option);
    });
  }
});

// Handle booking form submission
const bookingForm = document.getElementById("bookingForm");
bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookingData = {
    name: document.getElementById("name").value.trim(),
    guests: document.getElementById("guests").value.trim(),
    state: stateSelect.value,
    place: placeSelect.value,
    arrival: document.getElementById("arrival").value,
    phone: document.getElementById("phone").value.trim(),
    bookingDate: new Date().toISOString()
  };

  if (!bookingData.name || !bookingData.guests || !bookingData.state ||
    !bookingData.place || !bookingData.arrival || !bookingData.phone) {
    Swal.fire("Error", "All fields are required!", "error");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      Swal.fire("Authentication Required", "Please login before booking.", "warning");
      return;
    }

    try {
      bookingData.userId = user.uid;
      const bookingsRef = ref(database, "userBookings");
      await push(bookingsRef, bookingData);
      console.log("Booking stored successfully:", bookingData);

      const guidesRef = ref(database, "guides");
      const guidesSnapshot = await get(guidesRef);
      if (!guidesSnapshot.exists()) {
        console.log("No guides found in Firebase.");
        Swal.fire("No Guides Available", "No matching tour guides found.", "warning");
        return;
      }

      const guides = guidesSnapshot.val();
      let matchingGuides = [];

      Object.entries(guides).forEach(([guideId, guide]) => {
        if (guide.mainLocation === bookingData.state && guide.tourPlace === bookingData.place) {
          matchingGuides.push({ id: guideId, ...guide });
        }
      });

      if (matchingGuides.length > 0) {
        console.log("Matching guides found:", matchingGuides);
        localStorage.setItem("matchingGuides", JSON.stringify(matchingGuides));
        window.location.href = "../usermatched/usermatched.html";
      } else {
        Swal.fire("No Guides Found", "No guides match your selected location and place.", "warning");
      }
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire("Error", error.message || "Something went wrong!", "error");
    }
  });
});
