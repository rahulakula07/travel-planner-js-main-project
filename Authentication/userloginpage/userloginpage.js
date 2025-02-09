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
    spaceBetween:20,
    loop:true,
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAShtd_GRXpbX14TX8UGpK21f6JNw89eqk",
    authDomain: "travel-planner-f3e4f.firebaseapp.com",
    projectId: "travel-planner-f3e4f",
    storageBucket: "travel-planner-f3e4f.appspot.com",
    messagingSenderId: "1080007553754",
    appId: "1:1080007553754:web:97f9efae8223640580abe3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("bookingForm");

    const stateDropdown = document.getElementById("state");
    const placeDropdown = document.getElementById("place");

    const locationPlaces = {
        "Hyderabad": ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Salar Jung Museum"],
        "Andhra Pradesh": ["Tirupati Temple", "Araku Valley", "Borra Caves", "Visakhapatnam Beach", "Kailasagiri"],
        "Goa": ["Baga Beach", "Calangute Beach", "Dudhsagar Waterfalls", "Fort Aguada", "Anjuna Flea Market"],
        "Kerala": ["Alleppey Backwaters", "Munnar Tea Gardens", "Kovalam Beach", "Periyar Wildlife Sanctuary", "Fort Kochi"],
        "Maldives": ["Male City", "Banana Reef", "Artificial Beach", "National Museum", "Hukuru Miskiy"],
        "Lakshadweep": ["Agatti Island", "Bangaram Atoll", "Kadmat Island", "Minicoy Island", "Kavaratti Island"]
    };

    // Populate states dropdown
    Object.keys(locationPlaces).forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateDropdown.appendChild(option);
    });

    // Populate places dropdown based on selected state
    stateDropdown.addEventListener("change", function() {
        placeDropdown.innerHTML = '<option value="">Select Place</option>';
        placeDropdown.disabled = !this.value;

        if (this.value) {
            locationPlaces[this.value].forEach(place => {
                const option = document.createElement("option");
                option.value = place;
                option.textContent = place;
                placeDropdown.appendChild(option);
            });
        }
    });

    // Handle form submission
    bookingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const bookingData = {
            name: document.getElementById("name").value.trim(),
            guests: document.getElementById("guests").value,
            state: document.getElementById("state").value,
            place: document.getElementById("place").value,
            arrival: document.getElementById("arrival").value,
            phone: document.getElementById("phone").value.trim(),
            bookingDate: new Date().toISOString()
        };

        if (!bookingData.state || !bookingData.place) {
            alert("Please select a state and a place.");
            return;
        }

        try {
            const bookingsRef = ref(database, "bookings");
            await push(bookingsRef, bookingData);

            alert("Booking successful!");
            bookingForm.reset();
            placeDropdown.disabled = true;
        } catch (error) {
            alert("Error booking: " + error.message);
            console.error("Booking error:", error);
        }
    });
});
