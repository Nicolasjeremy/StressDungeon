
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1WNLBWHJP0mUq5NyJe8UBqcYY-vwiUxM",
  authDomain: "stressdungeon.firebaseapp.com",
  projectId: "stressdungeon",
  storageBucket: "stressdungeon.appspot.com",
  messagingSenderId: "216128080876",
  appId: "1:216128080876:web:f5d5eae1995a1d1fe3cec9",
  measurementId: "G-WS87T99HRK",
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
  signInSuccessUrl: "/StressDungeon/frontend/dashboard/dashboard.html", // Redirect after sign-in
  callbacks: {
    uiShown: () => {
      document.getElementById("loader").style.display = "none";
    },
  },
});

// Function to show the welcome message and continue button
function showWelcomeMessage(user) {
  const container = document.getElementById("firebaseui-auth-container");
  container.style.display = "none";

  const loader = document.getElementById("loader");
  loader.style.display = "block";
  loader.innerHTML = `
    <h2>Hello, ${user.displayName || user.email}!</h2>
    <button id="continue-button" class="continue-button">Continue</button>
  `;

  // Add click event to the "Continue" button
  document.getElementById("continue-button").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/dashboard/dashboard.html"; // Redirect to the dashboard page
  });
}

// Monitor authentication state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("User is signed in:", user);

    // Save user data to the backend
    await saveUserToBackend(user);

    // Fetch and display user progress
    await fetchUserProgress(user.uid);

    // Show welcome message and continue button
    showWelcomeMessage(user);
  } else {
    console.log("No user is signed in.");
    document.getElementById("firebaseui-auth-container").style.display = "block";
    document.getElementById("loader").innerText = "Loading...";
  }
});

// Logout button functionality
document.getElementById("logout")?.addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      console.log("User signed out.");
      window.location.href = "/"; // Redirect back to the home/login page
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});

// Function to save user data to the backend
async function saveUserToBackend(user) {
  try {
    const response = await fetch(`https://stressdungeon.onrender.com/${user.uid}`, {
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
    const response = await fetch(`https://stressdungeon.onrender.com/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user progress");
    }

    const data = await response.json();
    console.log("User progress fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
}
