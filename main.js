import { fetchGames } from "./api.js";

const gamesContainer = document.getElementById("games-container");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const games = await fetchGames("-metacritic", 20);
    games.forEach((game) => {
      const gameCard = createGameCard(game);
      gamesContainer.appendChild(gameCard);
    });
  } catch (error) {
    console.error("Failed to load top rated games:", error);
  }
});

function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.innerHTML = `
        <img src="${game.background_image}" alt="${game.name}">
        <div class="game-info">
            <div class="game-title">${game.name}</div>
            <div class="game-rating">Rating: ${game.metacritic}</div>
        </div>
    `;
  return card;
}
