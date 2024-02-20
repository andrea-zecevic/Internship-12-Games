import {
  fetchGames,
  fetchPlatforms,
  fetchGameById,
  fetchDevelopers,
  fetchGamesByDeveloper,
} from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const topGamesContainer = document.getElementById("games-container");
  try {
    const games = await fetchGames({ ordering: "-metacritic", page_size: 20 });
    games.forEach((game) => {
      const gameCard = createGameCard(game);
      topGamesContainer.appendChild(gameCard);
    });
  } catch (error) {
    console.error("Failed to load top rated games:", error);
  }
});

function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.innerHTML = `
  <img src="${game.background_image || "placeholder-image.jpg"}" alt="${
    game.name
  }">
  <div class="game-info">
    <div class="game-title">${game.name}</div>
    <div class="game-rating">Rating: ${game.metacritic || "N/A"}</div>
  </div>
`;
  return card;
}

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", async () => {
  const searchTerm = prompt("Please enter the game name:");
  if (searchTerm) {
    const searchResultsContainer = document.getElementById(
      "search-results-container"
    );
    try {
      const games = await fetchGames({
        search: searchTerm,
        ordering: "-released",
        page_size: 10,
      });
      searchResultsContainer.innerHTML = "";
      games.forEach((game) => {
        const gameCard = createGameCard(game);
        searchResultsContainer.appendChild(gameCard);
      });
    } catch (error) {
      console.error("Failed to search for games:", error);
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const platforms = await fetchPlatforms();
    displayPlatforms(platforms);
  } catch (error) {
    console.error("Failed to load platforms:", error);
  }
});

function displayPlatforms(platforms) {
  const platformsContainer = document.getElementById("platforms-container");
  platformsContainer.innerHTML = "";

  platforms.forEach((platform) => {
    const platformCard = document.createElement("div");
    platformCard.className = "platform-card";
    platformCard.innerHTML = `
        <div class="platform-name">${platform.name}</div>
      `;
    platformsContainer.appendChild(platformCard);
  });
}

async function searchGamesByPlatforms() {
  const userInput = prompt("Enter the names of platforms separated by commas:");
  if (userInput) {
    const platformNames = userInput
      .split(",")
      .map((name) => name.trim().toLowerCase());
    const platforms = await fetchPlatforms();

    const filteredPlatforms = platforms.filter((platform) =>
      platformNames.includes(platform.name.toLowerCase())
    );
    const platformIds = filteredPlatforms
      .map((platform) => platform.id)
      .slice(0, 10);

    if (platformIds.length > 0) {
      const games = await fetchGames({
        platforms: platformIds.join(","),
        page_size: 20,
        ordering: "name",
      });
      displayGames(games, "platform-search-results-container");
    } else {
      alert("No platforms found with the given names.");
    }
  }
}

function displayGames(games, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  games.forEach((game) => {
    const gameCard = createGameCard(game);
    container.appendChild(gameCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const platformSearchButton = document.getElementById(
    "platform-search-button"
  );
  platformSearchButton.addEventListener("click", searchGamesByPlatforms);
});

function displayGameDetails(game) {
  const detailsContainer = document.getElementById("game-details-container");
  detailsContainer.innerHTML = "";

  const gameCard = document.createElement("div");
  gameCard.className = "game-card";
  gameCard.innerHTML = `
      <img src="${game.background_image || "placeholder-image.jpg"}" alt="${
    game.name
  }">
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>Released: ${game.released}</p>
      </div>
    `;

  const rating = Math.round(game.rating / 2);
  const starsContainer = document.createElement("div");
  starsContainer.className = "stars-container";

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("span");
    star.textContent = i < rating ? "★" : "☆";
    star.style.color = i < rating ? "#FFD700" : "#ccc";
    starsContainer.appendChild(star);
  }

  detailsContainer.appendChild(gameCard);
  detailsContainer.appendChild(starsContainer);
}

document
  .getElementById("fetch-game-button")
  .addEventListener("click", async () => {
    const gameId = prompt("Please enter the game ID:");
    if (gameId) {
      const game = await fetchGameById(gameId);
      displayGameDetails(game);
    }
  });

function displayStores(game) {
  const storesContainer = document.getElementById("stores-container");
  storesContainer.innerHTML = "";

  if (game.stores && game.stores.length > 0) {
    game.stores.forEach((store) => {
      const storeCard = document.createElement("div");
      storeCard.className = "store-card";

      storeCard.innerHTML = `
                <img src="${store.store.image_background}" alt="${store.store.name}" class="store-image">
                <div class="store-info">
                    <h3>${store.store.name}</h3>
                    <p>Games count: ${store.store.games_count}</p>
                </div>
            `;

      storesContainer.appendChild(storeCard);
    });
  } else {
    storesContainer.innerHTML = "<p>No stores found for this game.</p>";
  }
}

document
  .getElementById("fetch-stores-button")
  .addEventListener("click", async () => {
    const gameId = prompt("Please enter the game ID:");
    if (gameId) {
      const game = await fetchGameById(gameId);
      displayStores(game);
    }
  });

function displayDeveloperGames(games, developerName) {
  const developerGamesContainer = document.createElement("div");
  developerGamesContainer.className = "developer-games-container";

  const title = document.createElement("h3");
  title.textContent = `${developerName}'s Games`;
  developerGamesContainer.appendChild(title);

  games.forEach((game) => {
    const gameCard = createGameCard(game);
    developerGamesContainer.appendChild(gameCard);
  });

  document.body.appendChild(developerGamesContainer);
}

document
  .getElementById("select-developers-button")
  .addEventListener("click", async () => {
    const developers = await fetchDevelopers();
    const developerNames = developers.map((dev) => dev.name).join(", ");
    const userInput = prompt(
      `Enter developer names separated by commas: ${developerNames}`
    );
    const selectedDeveloperNames = userInput
      .split(",")
      .map((name) => name.trim());

    selectedDeveloperNames.forEach(async (name) => {
      const developer = developers.find(
        (dev) => dev.name.toLowerCase() === name.toLowerCase()
      );
      if (developer) {
        await fetchGamesByDeveloper(
          developer.id,
          developer.name,
          displayDeveloperGames
        );
      } else {
        console.log(`Developer with name ${name} not found.`);
      }
    });
  });
