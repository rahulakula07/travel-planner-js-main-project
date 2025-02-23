import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
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

document.addEventListener("DOMContentLoaded", async () => {
    const guideDetailsContainer = document.getElementById("guideDetails");

    const guidesRef = ref(database, "guides");
    const userBookingsRef = ref(database, "userBookings");

    let currentUser = null;

    // Check if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            console.log("Logged-in User:", user.displayName, "UID:", user.uid);
        } else {
            console.warn("No user logged in. Booking requires authentication.");
        }
    });

    try {
        // Fetch Guides Data
        const guidesSnapshot = await get(guidesRef);
        const userBookingsSnapshot = await get(userBookingsRef);

        if (guidesSnapshot.exists() && userBookingsSnapshot.exists()) {
            const guides = guidesSnapshot.val();
            const userBookings = userBookingsSnapshot.val();

            console.log("Fetched Guides:", guides);
            console.log("Fetched User Bookings:", userBookings);

            // Get all booked places
            const bookedPlaces = new Set(
                Object.values(userBookings).map(booking => booking.place)
            );

            // Filter guides based on booked places
            let filteredGuides = Object.keys(guides)
                .map(guideId => ({
                    id: guideId,
                    ...guides[guideId]
                }))
                .filter(guide => bookedPlaces.has(guide.tourPlace));

            guideDetailsContainer.innerHTML = "<h2>Available Guides</h2>";

            if (filteredGuides.length > 0) {
                filteredGuides.forEach(guide => {
                    const guideCard = document.createElement("div");
                    guideCard.classList.add("guide-card");
                    guideCard.innerHTML = `
                        <h3>${guide.name || "Unknown Guide"}</h3>
                        <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
                        <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
                        <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
                        <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
                        <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
                        <button class="book-now" data-guide-id="${guide.id}">Book Now</button>
                        <hr>
                    `;
                    guideDetailsContainer.appendChild(guideCard);
                });

                // Add Event Listeners for "Book Now" buttons
                document.querySelectorAll(".book-now").forEach(button => {
                    button.addEventListener("click", async (event) => {
                        if (!currentUser) {
                            alert("You must be logged in to book a guide!");
                            return;
                        }
                        const guideId = event.target.dataset.guideId;
                        const userName = currentUser.displayName || prompt("Enter your name:");
                        const userUID = currentUser.uid;
                        if (userName) {
                            await bookGuide(guideId, userName, userUID);
                        }
                    });
                });
            } else {
                guideDetailsContainer.innerHTML += "<p>No guides available for the booked places.</p>";
            }
        } else {
            console.warn("No data found in Firebase.");
            guideDetailsContainer.innerHTML = "<h2>Available Guides</h2><p>No guides available.</p>";
        }
    } catch (error) {
        console.error("Error fetching guides:", error);
        guideDetailsContainer.innerHTML = "<h2>Available Guides</h2><p>Error loading guide details.</p>";
    }
});

// Function to book a guide
async function bookGuide(guideId, userName, userUID) {
    try {
        const bookedUsersRef = ref(database, `guides/${guideId}/bookedUsers`);
        const newBookingRef = push(bookedUsersRef); // Generates a unique key for each booking

        await set(newBookingRef, {
            userName: userName,
            uid: userUID,
            bookingTime: new Date().toISOString()
        });

        alert("Booking successful!");
        console.log(`User ${userName} (UID: ${userUID}) booked guide ${guideId}`);
    } catch (error) {
        console.error("Error booking guide:", error);
        alert("Error booking guide. Please try again.");
    }
}



// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAShtd_GRXpbX14TX8UGpK21f6JNw89eqk",
//     authDomain: "travel-planner-f3e4f.firebaseapp.com",
//     projectId: "travel-planner-f3e4f",
//     storageBucket: "travel-planner-f3e4f.appspot.com",
//     messagingSenderId: "1080007553754",
//     appId: "1:1080007553754:web:97f9efae8223640580abe3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// document.addEventListener("DOMContentLoaded", async () => {
//     const guideDetailsContainer = document.getElementById("guideDetails");

//     const guidesRef = ref(database, "guides");
//     const userBookingsRef = ref(database, "userBookings");

//     try {
//         // Fetch Guides Data
//         const guidesSnapshot = await get(guidesRef);
//         const userBookingsSnapshot = await get(userBookingsRef);

//         if (guidesSnapshot.exists() && userBookingsSnapshot.exists()) {
//             const guides = guidesSnapshot.val();
//             const userBookings = userBookingsSnapshot.val();

//             console.log("Fetched Guides:", guides);
//             console.log("Fetched User Bookings:", userBookings);

//             // Get all booked places
//             const bookedPlaces = new Set(
//                 Object.values(userBookings).map(booking => booking.place)
//             );

//             // Filter guides based on booked places
//             let filteredGuides = Object.keys(guides)
//                 .map(guideId => ({
//                     id: guideId,
//                     ...guides[guideId]
//                 }))
//                 .filter(guide => bookedPlaces.has(guide.tourPlace));

//             guideDetailsContainer.innerHTML = "<h2>Available Guides</h2>";

//             if (filteredGuides.length > 0) {
//                 filteredGuides.forEach(guide => {
//                     const guideCard = document.createElement("div");
//                     guideCard.classList.add("guide-card");
//                     guideCard.innerHTML = `
//                         <h3>${guide.name || "Unknown Guide"}</h3>
//                         <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
//                         <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
//                         <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
//                         <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
//                         <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
//                         <button class="book-now" data-guide-id="${guide.id}">Book Now</button>
//                         <hr>
//                     `;
//                     guideDetailsContainer.appendChild(guideCard);
//                 });

//                 // Add Event Listeners for "Book Now" buttons
//                 document.querySelectorAll(".book-now").forEach(button => {
//                     button.addEventListener("click", async (event) => {
//                         const guideId = event.target.dataset.guideId;
//                         const userName = prompt("Enter your name to book the guide:");
//                         if (userName) {
//                             await bookGuide(guideId, userName);
//                         }
//                     });
//                 });
//             } else {
//                 guideDetailsContainer.innerHTML += "<p>No guides available for the booked places.</p>";
//             }
//         } else {
//             console.warn("No data found in Firebase.");
//             guideDetailsContainer.innerHTML = "<h2>Available Guides</h2><p>No guides available.</p>";
//         }
//     } catch (error) {
//         console.error("Error fetching guides:", error);
//         guideDetailsContainer.innerHTML = "<h2>Available Guides</h2><p>Error loading guide details.</p>";
//     }
// });

// // Function to book a guide
// async function bookGuide(guideId, userName) {
//     try {
//         const bookedUsersRef = ref(database, `guides/${guideId}/bookedUsers`);
//         const newBookingRef = push(bookedUsersRef); // Generates a unique key for each booking

//         await set(newBookingRef, {
//             userName: userName,
//             bookingTime: new Date().toISOString()
//         });

//         alert("Booking successful!");
//         console.log(`User ${userName} booked guide ${guideId}`);
//     } catch (error) {
//         console.error("Error booking guide:", error);
//         alert("Error booking guide. Please try again.");
//     }
// }
