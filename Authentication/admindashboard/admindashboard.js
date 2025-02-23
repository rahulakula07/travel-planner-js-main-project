const managecntbtn = document.getElementById("managecntbtn");
managecntbtn.addEventListener("click", () => {
    location.href = "../managecontentadmin/managecontent.html";
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const auth = getAuth(app);

// Wait for user authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Authenticated Guide UID:", user.uid);
        loadGuideData(user.uid);
    } else {
        console.warn("No guide logged in. Access denied.");
        alert("You must be logged in as a guide!");
    }
});

// Function to find the guide's unique key using the registeredBy UID
async function loadGuideData(authenticatedUID) {
    const guidesRef = ref(database, "guides");

    try {
        const snapshot = await get(guidesRef);
        const guidesData = snapshot.val();

        if (guidesData) {
            let guideKey = null;

            // Find the guide registered by the authenticated UID
            Object.entries(guidesData).forEach(([key, guide]) => {
                if (guide.registeredBy === authenticatedUID) {
                    guideKey = key;
                }
            });

            if (guideKey) {
                console.log("Guide Key Found:", guideKey);
                loadUserBookings(guideKey);
            } else {
                console.log("No matching guide found for this UID.");
            }
        } else {
            console.log("No guides found in the database.");
        }
    } catch (error) {
        console.error("Error fetching guides:", error);
    }
}

// Function to load user bookings for the authenticated guide
async function loadUserBookings(guideKey) {
    const bookedUsersRef = ref(database, `guides/${guideKey}/bookedUsers`);

    try {
        const snapshot = await get(bookedUsersRef);
        const usersData = snapshot.val();

        if (usersData) {
            displayUserBookings(guideKey, usersData);
        } else {
            console.log("No users have booked this guide yet.");
            document.getElementById("userListContainer").innerHTML = "<p>No bookings found.</p>";
        }
    } catch (error) {
        console.error("Error fetching booked users:", error);
    }
}

// Function to display user bookings with buttons for confirmation & rejection
function displayUserBookings(guideKey, usersData) {
    const userListContainer = document.getElementById("userListContainer");
    userListContainer.innerHTML = ""; // Clear previous data

    Object.entries(usersData).forEach(([bookingId, user]) => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        userCard.innerHTML = `
            <div class="card">
                <h3>${user.userName}</h3>
                <p><strong>UID:</strong> ${user.uid}</p>
                <p><strong>Booking Time:</strong> ${new Date(user.bookingTime).toLocaleString()}</p>
                <p><strong>Status:</strong> <span id="status-${bookingId}" class="${user.status || 'pending'}">${user.status || 'Pending'}</span></p>
                <div class="buttons">
                    <button class="confirm-btn" onclick="updateBookingStatus('${guideKey}', '${bookingId}', 'Confirmed')">Confirm</button>
                    <button class="reject-btn" onclick="updateBookingStatus('${guideKey}', '${bookingId}', 'Rejected')">Reject</button>
                </div>
            </div>
        `;
        userListContainer.appendChild(userCard);
    });
}

// Function to update booking status in Firebase
function updateBookingStatus(guideKey, bookingId, status) {
    const bookingRef = ref(database, `guides/${guideKey}/bookedUsers/${bookingId}`);
    
    update(bookingRef, { status })
        .then(() => {
            console.log(`Booking ${bookingId} updated to ${status}`);
            document.getElementById(`status-${bookingId}`).textContent = status;
            document.getElementById(`status-${bookingId}`).className = status.toLowerCase();
        })
        .catch(error => {
            console.error("Error updating booking status:", error);
        });
}

// Add Event Listener for "Manage Users" Button
document.getElementById("manageUsersBtn").addEventListener("click", () => {
    document.getElementById("userList").style.display = "block"; // Show user list
});
