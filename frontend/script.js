require("dotenv").config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase using the compat layer
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Initialize FirebaseUI
const ui = new firebaseui.auth.AuthUI(auth);

// FirebaseUI configuration
ui.start("#firebaseui-auth-container", {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInFlow: "popup", // Use popup for sign-in
  signInSuccessUrl: "/", // Redirect after sign-in
  callbacks: {
    uiShown: () => {
      document.getElementById("loader").style.display = "none";
    },
  },
});

// Function to save user data to the backend
async function saveUserToBackend(user) {
  try {
    const response = await fetch(`https://your-backend.onrender.com/user/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coins: 0, // Default coins for a new user
        level: 1, // Default level for a new user
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save user to backend");
    }

    console.log("User data saved to backend successfully");
  } catch (error) {
    console.error("Error saving user to backend:", error);
  }
}

// Function to fetch user progress from the backend
async function fetchUserProgress(userId) {
  try {
    const response = await fetch(`https://your-backend.onrender.com/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user progress");
    }

    const data = await response.json();
    console.log("User progress fetched:", data);

    // Update the UI with user progress
    document.getElementById("loader").innerText = `Welcome, ${data.email}. Coins: ${data.coins}`;
    return data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
}

// Monitor authentication state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("User is signed in:", user);

    // Save user data to the backend
    await saveUserToBackend(user);

    // Fetch and display user progress
    const progress = await fetchUserProgress(user.uid);
    if (progress) {
      document.getElementById("loader").innerText = `Welcome, ${progress.email}. Coins: ${progress.coins}`;
    } else {
      document.getElementById("loader").innerText = `Welcome, ${user.email}`;
    }

    // Hide the login form
    document.getElementById("firebaseui-auth-container").style.display = "none";
    document.getElementById("loader").style.display = "block";
  } else {
    console.log("No user is signed in.");
    document.getElementById("firebaseui-auth-container").style.display = "block";
    document.getElementById("loader").innerText = "Loading...";
  }
});

// Logout button functionality
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      console.log("User signed out.");
      window.location.href = "/"; // Redirect back to the home/login page
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});
