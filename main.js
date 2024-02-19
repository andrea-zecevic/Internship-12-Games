import { fetchGames } from "./api.js";

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
