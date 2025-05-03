// const managecntbtn = document.getElementById("managecntbtn");
// managecntbtn.addEventListener("click", () => {
//     location.href = "../managecontentadmin/managecontent.html";
// });

// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";


// const firebaseConfig = {
//     apiKey: "AIzaSyAShtd_GRXpbX14TX8UGpK21f6JNw89eqk",
//     authDomain: "travel-planner-f3e4f.firebaseapp.com",
//     projectId: "travel-planner-f3e4f",
//     storageBucket: "travel-planner-f3e4f.appspot.com",
//     messagingSenderId: "1080007553754",
//     appId: "1:1080007553754:web:97f9efae8223640580abe3"
// };


// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const auth = getAuth(app);


// onAuthStateChanged(auth, async (user) => {
//     if (user) {
//         console.log("Authenticated Guide UID:", user.uid);
//         loadGuideData(user.uid);
//     } else {
//         console.warn("No guide logged in. Access denied.");
//         Swal.fire({
//             icon: "warning",
//             title: "Access Denied",
//             text: "You must be logged in as a guide!"
//         });
//     }
// });


// async function loadGuideData(authenticatedUID) {
//     const guidesRef = ref(database, "guides");

//     try {
//         const snapshot = await get(guidesRef);
//         const guidesData = snapshot.val();

//         if (guidesData) {
//             let guideKey = null;
//             Object.entries(guidesData).forEach(([key, guide]) => {
//                 if (guide.registeredBy === authenticatedUID) {
//                     guideKey = key;
//                 }
//             });

//             if (guideKey) {
//                 console.log("Guide Key Found:", guideKey);
//                 loadUserBookings(guideKey);
//             } else {
//                 console.log("No matching guide found for this UID.");
//             }
//         } else {
//             console.log("No guides found in the database.");
//         }
//     } catch (error) {
//         console.error("Error fetching guides:", error);
//     }
// }


// async function loadUserBookings(guideKey) {
//     const bookedUsersRef = ref(database, `guides/${guideKey}/bookedUsers`);

//     try {
//         const snapshot = await get(bookedUsersRef);
//         const usersData = snapshot.val();

//         if (usersData) {
//             displayUserBookings(guideKey, usersData);
//         } else {
//             console.log("No users have booked this guide yet.");
//             document.getElementById("userListContainer").innerHTML = "<p>No bookings found.</p>";
//         }
//     } catch (error) {
//         console.error("Error fetching booked users:", error);
//     }
// }


// function displayUserBookings(guideKey, usersData) {
//     const userListContainer = document.getElementById("userListContainer");
//     userListContainer.innerHTML = "";

//     Object.entries(usersData).forEach(([bookingId, user]) => {
//         const userCard = document.createElement("div");
//         userCard.classList.add("user-card");

//         userCard.innerHTML = `
//             <div class="card">
//                 <h3>${user.userName}</h3>
//                 <!--<p><strong>UID:</strong> ${user.location}</p>--!>
//                 <p><strong>Booking Time:</strong> ${new Date(user.bookingTime).toLocaleString()}</p>
//                 <p><strong>Status:</strong> <span id="status-${bookingId}" class="${user.status || 'pending'}">${user.status || 'Pending'}</span></p>
//                 <div class="buttons">
//                     <button class="confirm-btn" onclick="updateBookingStatus('${guideKey}', '${bookingId}', 'Confirmed')">Confirm</button>
//                     <button class="reject-btn" onclick="updateBookingStatus('${guideKey}', '${bookingId}', 'Rejected')">Reject</button>
//                 </div>
//             </div>
//         `;
//         userListContainer.appendChild(userCard);
//     });
// }


// function updateBookingStatus(guideKey, bookingId, status) {
//     const bookingRef = ref(database, `guides/${guideKey}/bookedUsers/${bookingId}`);

//     update(bookingRef, { status })
//         .then(() => {
//             console.log(`Booking ${bookingId} updated to ${status}`);
//             document.getElementById(`status-${bookingId}`).textContent = status;
//             document.getElementById(`status-${bookingId}`).className = status.toLowerCase();
//         })
//         .catch(error => {
//             console.error("Error updating booking status:", error);
//         });
// }


// document.getElementById("manageUsersBtn").addEventListener("click", () => {
//     document.getElementById("userList").style.display = "block";
// });


// const logoutBtn = document.getElementById("logoutBtn");
// logoutBtn.addEventListener("click", () => {
//     Swal.fire({
//         title: 'Are you sure?',
//         text: "Do you want to log out?",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, log me out',
//         cancelButtonText: 'No, cancel',
//         reverseButtons: true
//     }).then((result) => {
//         if (result.isConfirmed) {
//             auth.signOut()
//                 .then(() => {
//                     console.log("User signed out successfully.");
//                     Swal.fire({
//                         icon: "success",
//                         title: "Logged Out",
//                         text: "You have been signed out.",
//                         showConfirmButton: false,
//                         timer: 1500
//                     }).then(() => {
//                         window.location.href = "../../index.html";
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Error signing out:", error);
//                     Swal.fire({
//                         icon: "error",
//                         title: "Logout Failed",
//                         text: "Please try again."
//                     });
//                 });
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//             console.log("Logout canceled.");
//         }
//     });
// });


const managecntbtn = document.getElementById("managecntbtn");
managecntbtn.addEventListener("click", () => {
    location.href = "../managecontentadmin/managecontent.html";
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
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
const database = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Authenticated Guide UID:", user.uid);
        loadGuideData(user.uid);
    } else {
        console.warn("No guide logged in. Access denied.");
        Swal.fire({
            icon: "warning",
            title: "Access Denied",
            text: "You must be logged in as a guide!"
        });
    }
});

async function loadGuideData(authenticatedUID) {
    const guidesRef = ref(database, "guides");

    try {
        const snapshot = await get(guidesRef);
        const guidesData = snapshot.val();

        if (guidesData) {
            let guideKey = null;
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

function displayUserBookings(guideKey, usersData) {
    const userListContainer = document.getElementById("userListContainer");
    userListContainer.innerHTML = "";

    Object.entries(usersData).forEach(([bookingId, user]) => {
        const col = document.createElement("div");
        col.className = "col-md-4"; // side-by-side layout

        const card = document.createElement("div");
        card.className = "card shadow-sm p-3 text-center";

        card.innerHTML = `
            <h5 class="fw-bold">${user.userName}</h5>
            <p><strong>Booking Time:</strong> ${new Date(user.bookingTime).toLocaleString()}</p>
            <p><strong>Status:</strong> <span id="status-${bookingId}" class="${(user.status || 'Pending').toLowerCase()}">${user.status || 'Pending'}</span></p>
            <div class="d-flex justify-content-around mt-3">
                <button class="btn btn-success" onclick="updateBookingStatus('${guideKey}', '${bookingId}', 'Confirmed')">Confirm</button>
                <button class="btn btn-danger" onclick="updateBookingStatus('${guideKey}', '${bookingId}', 'Rejected')">Reject</button>
            </div>
        `;

        col.appendChild(card);
        userListContainer.appendChild(col);
    });

    document.getElementById("userList").style.display = "block";
}

// Expose function globally for inline onclick handlers
window.updateBookingStatus = function (guideKey, bookingId, status) {
    const bookingRef = ref(database, `guides/${guideKey}/bookedUsers/${bookingId}`);

    update(bookingRef, { status })
        .then(() => {
            console.log(`Booking ${bookingId} updated to ${status}`);
            const statusSpan = document.getElementById(`status-${bookingId}`);
            statusSpan.textContent = status;
            statusSpan.className = status.toLowerCase();
        })
        .catch(error => {
            console.error("Error updating booking status:", error);
        });
};

document.getElementById("manageUsersBtn").addEventListener("click", () => {
    document.getElementById("userList").style.display = "block";
});

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
