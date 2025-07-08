/** @format */

// --- PWA Service Worker Registration ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Register the service worker with a relative path
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// --- ADVENTURE DATA ---
const adventureData = {
  Outdoors: [
    {
      name: "Local Park Adventure",
      description:
        "Explore the beautiful local parks with walking trails, playgrounds, and picnic areas. Perfect for families to enjoy nature and get some fresh air!",
      address: "Main Street Park, {location}",
      website: "https://www.nps.gov",
    },
    {
      name: "Nature Trail Hike",
      description:
        "Discover local wildlife and beautiful scenery on family-friendly hiking trails. Bring your camera to capture amazing nature photos!",
      address: "Nature Trail Head, {location}",
      website: "https://www.trails.com",
    },
    {
      name: "Community Garden Visit",
      description:
        "Learn about plants and gardening while exploring beautiful community gardens. Many gardens offer workshops and seasonal activities!",
      address: "Community Garden Center, {location}",
      website: "https://www.communitygarden.org",
    },
  ],
  Creative: [
    {
      name: "Local Art Museum",
      description:
        "Discover amazing artwork and participate in hands-on art activities designed for families. Many museums offer special kids' programs!",
      address: "Art Museum, {location}",
      website: "https://www.artmuseum.org",
    },
    {
      name: "Community Arts Center",
      description:
        "Join pottery classes, painting workshops, or craft sessions at your local arts center. Perfect for unleashing creativity together!",
      address: "Community Arts Center, {location}",
      website: "https://www.artscenter.org",
    },
    {
      name: "Local Library Creative Time",
      description:
        "Participate in storytelling, craft sessions, and creative workshops at your local library. Libraries often have amazing free programs for families!",
      address: "Public Library, {location}",
      website: "https://www.library.org",
    },
  ],
  Learning: [
    {
      name: "Science Museum Exploration",
      description:
        "Experience hands-on science exhibits and interactive displays that make learning fun for the whole family. Perfect for curious minds!",
      address: "Science Museum, {location}",
      website: "https://www.sciencemuseum.org",
    },
    {
      name: "Historical Society Tour",
      description:
        "Learn about local history through guided tours, historical artifacts, and interactive exhibits. Discover the fascinating stories of your community!",
      address: "Historical Society, {location}",
      website: "https://www.historicalsociety.org",
    },
    {
      name: "Planetarium Show",
      description:
        "Explore the wonders of space through immersive planetarium shows and astronomy programs. Learn about stars, planets, and the universe!",
      address: "Planetarium, {location}",
      website: "https://www.planetarium.org",
    },
  ],
  Active: [
    {
      name: "Family Bowling",
      description:
        "Enjoy strikes and spares at your local bowling alley with family-friendly lanes, bumpers for kids, and fun arcade games!",
      address: "Bowling Center, {location}",
      website: "https://www.bowlingcenter.com",
    },
    {
      name: "Community Recreation Center",
      description:
        "Stay active with swimming, basketball, or fitness classes at your local recreation center. Many centers offer family swim times and activities!",
      address: "Recreation Center, {location}",
      website: "https://www.recreationcenter.org",
    },
    {
      name: "Mini Golf Adventure",
      description:
        "Challenge the family to a fun round of mini golf with creative obstacles and themes. Perfect for all ages and skill levels!",
      address: "Mini Golf Course, {location}",
      website: "https://www.minigolf.com",
    },
  ],
  Foodie: [
    {
      name: "Local Farmers Market",
      description:
        "Explore fresh local produce, artisanal foods, and family-friendly vendors at your community farmers market. Perfect for food discovery!",
      address: "Farmers Market, {location}",
      website: "https://www.farmersmarket.org",
    },
    {
      name: "Family Cooking Class",
      description:
        "Learn to prepare delicious meals together in a fun, family-oriented cooking class. Create memories while learning new recipes!",
      address: "Culinary School, {location}",
      website: "https://www.cookingschool.com",
    },
    {
      name: "Local Ice Cream Shop",
      description:
        "Treat the family to delicious homemade ice cream with unique flavors and fun toppings. Perfect for a sweet family outing!",
      address: "Ice Cream Parlor, {location}",
      website: "https://www.icecreamshop.com",
    },
  ],
};

// --- LOCAL ADVENTURE GENERATOR ---
function generateLocalAdventure(location, timeFrame, interests) {
  // If no interests selected, pick a random category
  if (interests.length === 0) {
    const categories = Object.keys(adventureData);
    interests = [categories[Math.floor(Math.random() * categories.length)]];
  }

  // Pick a random interest from selected interests
  const selectedInterest =
    interests[Math.floor(Math.random() * interests.length)];

  // Get adventures for that interest
  const adventures = adventureData[selectedInterest];

  // Pick a random adventure
  const selectedAdventure =
    adventures[Math.floor(Math.random() * adventures.length)];

  // Customize the adventure with the location
  const customizedAdventure = {
    ...selectedAdventure,
    address: selectedAdventure.address.replace("{location}", location),
    description: selectedAdventure.description,
  };

  // Add time-specific note if needed
  if (timeFrame !== "any") {
    customizedAdventure.description += ` This activity is perfect for a ${timeFrame} outing!`;
  }

  return customizedAdventure;
}

// --- FORM SUBMISSION ---
const adventureForm = document.getElementById("adventureForm");
const generateBtn = document.getElementById("generateBtn");
const btnSpinner = generateBtn.querySelector(".spinner-border");

adventureForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Stop the form from submitting the traditional way

  // Show loading state
  setLoading(true);

  try {
    // 1. Get user selections
    const location = document.getElementById("location").value;
    const selectedTime = document.getElementById("time").value;
    const selectedInterests = Array.from(
      document.querySelectorAll(".interest-checkbox:checked")
    ).map((cb) => cb.value);

    // 2. Generate adventure using local data
    const adventure = generateLocalAdventure(
      location,
      selectedTime,
      selectedInterests
    );

    // Add a small delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    displayAdventure(adventure);
  } catch (error) {
    console.error("Error fetching adventure:", error);
    displayError(
      "Oops! We couldn't find an adventure right now. Please check your location or try different options!"
    );
  } finally {
    // Hide loading state
    setLoading(false);
  }
});

// --- HELPER FUNCTIONS ---

/**
 * Toggles the loading state of the generate button.
 * @param {boolean} isLoading - Whether to show the loading state.
 */
function setLoading(isLoading) {
  if (isLoading) {
    generateBtn.disabled = true;
    btnSpinner.style.display = "inline-block";
    generateBtn.childNodes[2].textContent = " Finding..."; // Adjust text node index if needed
  } else {
    generateBtn.disabled = false;
    btnSpinner.style.display = "none";
    generateBtn.childNodes[2].textContent = " Find an Adventure!"; // Adjust text node index if needed
  }
}

/**
 * Displays the generated adventure in a modal.
 * @param {object} adventure - The adventure object from the API.
 */
function displayAdventure(adventure) {
  const modalContentEl = document.getElementById("modalContent");
  const adventureModalLabel = document.getElementById("adventureModalLabel");

  adventureModalLabel.textContent = adventure.name || "Your Next Adventure!";

  // Create a placeholder image URL from the adventure name
  const imageName = encodeURIComponent(adventure.name.replace(/\s+/g, " "));
  const imageUrl = `https://placehold.co/800x400/81c784/ffffff?text=${imageName}`;

  modalContentEl.innerHTML = `
        <div class="text-center">
            <img src="${imageUrl}" class="img-fluid mb-4" alt="${
    adventure.name
  }" onerror="this.onerror=null;this.src='https://placehold.co/800x400/ffb74d/ffffff?text=Adventure+Awaits!';">
            <p class="lead fs-5">${
              adventure.description || "A fantastic place to explore!"
            }</p>
            <hr>
            <p><strong>📍 Address:</strong> ${
              adventure.address || "Not available"
            }</p>
            ${
              adventure.website
                ? `<a href="${adventure.website}" target="_blank" class="btn btn-info">Visit Website</a>`
                : ""
            }
        </div>
    `;

  const adventureModal = new bootstrap.Modal(
    document.getElementById("adventureModal")
  );
  adventureModal.show();
}

/**
 * Displays an error message in the modal.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
  const modalContentEl = document.getElementById("modalContent");
  const adventureModalLabel = document.getElementById("adventureModalLabel");

  adventureModalLabel.textContent = "Oh No!";

  modalContentEl.innerHTML = `
        <div class="text-center">
            <img src="https://placehold.co/800x400/ffb74d/ffffff?text=Something+Went+Wrong" class="img-fluid mb-4" alt="Error">
            <p class="lead fs-5">${message}</p>
        </div>
    `;

  const adventureModal = new bootstrap.Modal(
    document.getElementById("adventureModal")
  );
  adventureModal.show();
}
