
const firebaseConfig = {
  apiKey: "AIzaSyC1WNLBWHJP0mUq5NyJe8UBqcYY-vwiUxM",
  authDomain: "stressdungeon.firebaseapp.com",
  projectId: "stressdungeon",
  storageBucket: "stressdungeon.appspot.com",
  messagingSenderId: "216128080876",
  appId: "1:216128080876:web:f5d5eae1995a1d1fe3cec9",
  measurementId: "G-WS87T99HRK",
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const ui = new firebaseui.auth.AuthUI(auth);

ui.start("#firebaseui-auth-container", {
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInFlow: "popup",
  signInSuccessUrl: "/StressDungeon/frontend/hero-selection/hero.html",
  callbacks: {
    uiShown: () => {
      document.getElementById("loader").style.display = "none";
    },
  },
});

function showWelcomeMessage(user) {
  const container = document.getElementById("firebaseui-auth-container");
  container.style.display = "none";

  const loader = document.getElementById("loader");
  loader.style.display = "block";
  loader.innerHTML = `
    <h2>Hello, ${user.displayName || user.email}!</h2>
    <button id="continue-button" class="continue-button">Continue</button>
  `;

  document.getElementById("continue-button").addEventListener("click", () => {
    window.location.href = "/StressDungeon/frontend/hero-selection/hero.html"; 
  });
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("User is signed in:", user);
    await saveUserToBackend(user);

    await fetchUserProgress(user.uid);
    const userID = user.uid;
    localStorage.setItem("userID", userID);
    showWelcomeMessage(user);
  } else {
    console.log("No user is signed in.");
    localStorage.removeItem("userID");
    document.getElementById("firebaseui-auth-container").style.display = "block";
    document.getElementById("loader").innerText = "Loading...";
  }
});

document.getElementById("logout")?.addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      console.log("User signed out.");
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});

async function saveUserToBackend(user) {
  try {
    const response = await fetch(`https://stressdungeon.onrender.com/user/${user.uid}`);
    if (response.ok) {
      console.log("User already exists, no need to reset stats.");
      return;
    }

    const createResponse = await fetch(`https://stressdungeon.onrender.com/user/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coins: 0,
        level: 1,
      }),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to save user to backend");
    }

    console.log("New user created with default stats.");
  } catch (error) {
    console.error("Error saving user to backend:", error);
  }
}
async function fetchUserProgress(userId) {
  try {
    const response = await fetch(`https://stressdungeon.onrender.com/user/${userId}`);
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
