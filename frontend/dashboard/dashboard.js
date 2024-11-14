import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const auth = firebase.auth();

// Ensure only logged-in users can access this page
auth.onAuthStateChanged((user) => {
    if (!user) {
        // Redirect to the login page if no user is logged in
        window.location.href = "/";
    } else {
        console.log("User is signed in:", user);
        // You can dynamically display user data here
        document.querySelector("#stat-description").innerHTML = `
            <h2>Your Stats</h2>
            <p>Level: 5</p>
            <p>Email: ${user.email}</p>
        `;
    }
});

// Logout button functionality
document.getElementById("logout").addEventListener("click", () => {
    auth.signOut().then(() => {
        console.log("User signed out.");
        window.location.href = "/";
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
});
