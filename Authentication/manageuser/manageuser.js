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
  const loader = document.getElementById("loader"); 

  const guidesRef = ref(database, "guides");
  const userBookingsRef = ref(database, "userBookings");

  let currentUser = null;

  // Show loader and hide content
  loader.style.display = "block";
  guideDetailsContainer.style.display = "none";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      console.log("Logged-in User:", user.displayName, "UID:", user.uid);
    } else {
      console.warn("No user logged in. Booking requires authentication.");
    }
  });

  try {
    const guidesSnapshot = await get(guidesRef);
    const userBookingsSnapshot = await get(userBookingsRef);

    // Hide loader and show content
    loader.style.display = "none";
    guideDetailsContainer.style.display = "block";

    if (guidesSnapshot.exists() && userBookingsSnapshot.exists()) {
      const guides = guidesSnapshot.val();
      const userBookings = userBookingsSnapshot.val();

      console.log("Fetched Guides:", guides);
      console.log("Fetched User Bookings:", userBookings);

      const bookedPlaces = new Set(
        Object.values(userBookings).map(booking => booking.place)
      );

      let filteredGuides = Object.keys(guides)
        .map(guideId => ({
          id: guideId,
          ...guides[guideId]
        }))
        .filter(guide => bookedPlaces.has(guide.tourPlace));

      guideDetailsContainer.innerHTML = "<h2>Booked Guides</h2>";

      if (filteredGuides.length > 0) {
        filteredGuides.forEach(guide => {
          const guideCard = document.createElement("div");
          guideCard.classList.add("guide-card");

          const formattedName = guide.name
            ? guide.name.replace(/\b\w/g, char => char.toUpperCase())
            : "Unknown Guide";

          guideCard.innerHTML = `
            <h3>${formattedName}</h3>
            <p><strong>Main Location:</strong> ${guide.mainLocation || "Not Provided"}</p>
            <p><strong>Tour Place:</strong> ${guide.tourPlace || "Not Provided"}</p>
            <p><strong>Description:</strong> ${guide.tourDescription || "No description available"}</p>
            <p><strong>Charge Per Day:</strong> ${guide.chargePerDay ? `₹${guide.chargePerDay}` : "N/A"}</p>
            <p><strong>Charge Per Hour:</strong> ${guide.chargePerHour ? `₹${guide.chargePerHour}` : "N/A"}</p>
            <p><strong>Status:</strong> Notset</p> 
            <hr>
          `;
          guideDetailsContainer.appendChild(guideCard);
        });

        document.querySelectorAll(".book-now").forEach(button => {
          button.addEventListener("click", async (event) => {
            if (!currentUser) {
              Swal.fire({
                icon: 'warning',
                title: 'Authentication Required',
                text: 'You must be logged in to book a guide!',
                confirmButtonText: 'OK'
              });
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
      guideDetailsContainer.innerHTML = "<h2>Booked Guides</h2><p>No guides available.</p>";
    }
  } catch (error) {
    loader.style.display = "none";
    guideDetailsContainer.style.display = "block";
    console.error("Error fetching guides:", error);
    guideDetailsContainer.innerHTML = "<h2>Booked Guides</h2><p>Error loading guide details.</p>";
  }
});

async function bookGuide(guideId, userName, userUID) {
  try {
    const bookedUsersRef = ref(database, `guides/${guideId}/bookedUsers`);
    const newBookingRef = push(bookedUsersRef);

    await set(newBookingRef, {
      userName: userName,
      uid: userUID,
      bookingTime: new Date().toISOString()
    });

    const guideRef = ref(database, `guides/${guideId}`);
    const guideSnapshot = await get(guideRef);
    if (guideSnapshot.exists()) {
      const guide = guideSnapshot.val();

      Swal.fire({
        icon: 'success',
        title: 'Booking Successful',
        html: `
          <p><strong>Guide:</strong> ${guide.name}</p>
          <p><strong>Tour Place:</strong> ${guide.tourPlace}</p>
          <p><strong>Main Location:</strong> ${guide.mainLocation}</p>
          <p><strong>Description:</strong> ${guide.tourDescription || 'No description available'}</p>
          <p><strong>Charge Per Day:</strong> ₹${guide.chargePerDay || 'N/A'}</p>
          <p><strong>Charge Per Hour:</strong> ₹${guide.chargePerHour || 'N/A'}</p>
          <p><strong>Status:</strong> Your booking is confirmed!</p>
        `,
        confirmButtonText: 'OK'
      });

      console.log(`User ${userName} (UID: ${userUID}) booked guide ${guide.name}`);
    }
  } catch (error) {
    console.error("Error booking guide:", error);

    Swal.fire({
      icon: 'error',
      title: 'Booking Error',
      text: 'Error booking guide. Please try again.',
      confirmButtonText: 'OK'
    });
  }
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to log out?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, log me out',
    cancelButtonText: 'No, cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      auth.signOut()
        .then(() => {
          console.log("User signed out successfully.");
          Swal.fire({
            icon: "success",
            title: "Logged Out",
            text: "You have been signed out.",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = "../../index.html";
          });
        })
        .catch((error) => {
          console.error("Error signing out:", error);
          Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: "Please try again."
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("Logout canceled.");
    }
  });
});

let log = document.getElementById("log");
log.addEventListener("click", () => {
  window.location.href = "/Authentication/userloginpage/userloginpage.html";
});
