
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const backendUrl = "https://stressdungeon.onrender.com";

// Backend API URL
const BACKEND_URL = "https://stressdungeon.onrender.com";

// Global coin management
let userCoins = 0;

// Fetch user progress from backend
async function fetchUserProgress(userId) {
  try {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user progress");

    const data = await response.json();
    console.log("User progress fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return { coins: 0, level: 1 }; // Default data on error
  }
}

// Save user data to backend
async function saveUserToBackend(userId, coins, level) {
  try {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coins, level }),
    });
    if (!response.ok) throw new Error("Failed to save user progress");

    console.log("User data saved successfully");
  } catch (error) {
    console.error("Error saving user data to backend:", error);
  }
}

// Get coins from memory
function getCoins() {
  return userCoins;
}

// Add coins and save to backend
async function addCoins(amount) {
  userCoins += amount;
  const user = firebase.auth().currentUser;
  if (user) {
    await saveUserToBackend(user.uid, userCoins, 1);
  }
  updateCoinDisplay();
}

// Update coin display
function updateCoinDisplay() {
  const coinDisplay = document.getElementById("coin-display");
  if (coinDisplay) {
    coinDisplay.textContent = `Coins: ${getCoins()}`;
  }
}

// Show welcome message
function showWelcomeMessage(user) {
  const loader = document.getElementById("loader");
  loader.innerHTML = `
    <h2>Hello, ${user.displayName || user.email}!</h2>
    <button id="continue-button" class="continue-button">Continue</button>
  `;

  document.getElementById("continue-button").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/dashboard/dashboard.html";
  });
}

// Monitor authentication state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("User is signed in:", user);

    // Fetch user progress from backend
    const progress = await fetchUserProgress(user.uid);
    userCoins = progress.coins; // Sync coins with backend
    updateCoinDisplay();

    // Show welcome message
    showWelcomeMessage(user);
  } else {
    console.log("No user is signed in.");
    document.getElementById("firebaseui-auth-container").style.display = "block";
    document.getElementById("loader").innerText = "Loading...";
  }
});
