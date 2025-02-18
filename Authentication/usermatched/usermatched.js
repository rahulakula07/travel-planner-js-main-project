import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase Configuration
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
const database = getDatabase(app);

const guideDetailsContainer = document.getElementById("guideDetails");

// Reference to all guides
const guidesRef = ref(database, "guides");

get(guidesRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const guides = snapshot.val();
            console.log("Fetched Guides Data:", guides); // Debugging Firebase data

            // Loop through each guide and display details
            guideDetailsContainer.innerHTML = "<h2>Available Guides</h2>";
            Object.keys(guides).forEach((guideId) => {
                const guide = guides[guideId];
                guideDetailsContainer.innerHTML += `
                    <div class="guide-card">
                        <h3>${guide.name || "Unknown Guide"}</h3>
                        <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
                        <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
                        <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
                        <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
                        <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
                        <a href="guideDetails.html?guideId=${guideId}">Book Now</a>
                        <hr>
                    </div>
                `;
            });
        } else {
            console.warn("No guides found in Firebase.");
            guideDetailsContainer.innerHTML = "<p>No guides available.</p>";
        }
    })
    .catch((error) => {
        console.error("Error fetching guides:", error);
        guideDetailsContainer.innerHTML = "<p>Error loading guide details.</p>";
    });
