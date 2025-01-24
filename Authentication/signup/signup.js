// let submit=document.getElementById("submit")

// submit.addEventListener("click",()=>{
//     location.href="../login/login.html"
// })

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values of email and password inputs
    const email = document.querySelector("input[type='email']").value.trim();
    const password = document.querySelector("input[type='password']").value.trim();

    // Check if both fields are filled
    if (email && password) {
        // Redirect to login page
        location.href = "../login/login.html";
    } else {
        // Alert the user to fill all fields
        alert("Please fill in both email and password.");
    }
});
