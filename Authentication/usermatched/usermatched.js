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

// Get Guide ID from URL
const urlParams = new URLSearchParams(window.location.search);
const guideId = urlParams.get("guideId");
console.log("Guide ID from URL:", guideId); // Debugging guide ID

const guideDetailsContainer = document.getElementById("guideDetails");

if (guideId) {
    const guideRef = ref(database, `guides/${guideId}`);
    
    get(guideRef).then((snapshot) => {
        if (snapshot.exists()) {
            const guide = snapshot.val();
            console.log("Fetched Guide Data:", guide); // Debugging Firebase data

            // Display guide details
            guideDetailsContainer.innerHTML = `
                <h2>${guide.name || "Unknown Guide"}</h2>
                <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
                <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
                <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
                <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
                <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
            `;
        } else {
            console.warn("No guide found in Firebase.");
            guideDetailsContainer.innerHTML = "<p>No guide found.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching guide:", error);
        guideDetailsContainer.innerHTML = "<p>Error loading guide details.</p>";
    });
} else {
    console.warn("No Guide ID in URL");
    guideDetailsContainer.innerHTML = "<p>Invalid guide selection.</p>";
}
