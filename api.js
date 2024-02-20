const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec";
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGames({
  search = "",
  ordering = "",
  page_size = 10,
} = {}) {
  const url = new URL(`${BASE_URL}/games`);
  url.search = new URLSearchParams({
    key: API_KEY,
    search,
    ordering,
    page_size,
  }).toString();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}

export async function fetchPlatforms() {
  const url = `${BASE_URL}/platforms?key=${API_KEY}&page_size=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching platforms:", error);
    throw error;
  }
}

export async function fetchGameById(gameId) {
  const url = `${BASE_URL}/games/${gameId}?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const game = await response.json();
    return game;
  } catch (error) {
    console.error("Error fetching game:", error);
    throw error;
  }
}

export async function fetchDevelopers() {
  const url = `${BASE_URL}/developers?key=${API_KEY}&page_size=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const { results } = await response.json();
    return results;
  } catch (error) {
    console.error("Error fetching developers:", error);
    throw error;
  }
}

export async function fetchGamesByDeveloper(
  developerId,
  developerName,
  callback
) {
  const url = `${BASE_URL}/games?key=${API_KEY}&developers=${developerId}&page_size=10&ordering=-rating`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const { results } = await response.json();
    if (callback) callback(results, developerName);
  } catch (error) {
    console.error(
      `Error fetching games for developer ${developerName}:`,
      error
    );
    throw error;
  }
}

export async function fetchGamesByDateRange(startDate, endDate) {
  const formattedStartDate = startDate.replaceAll("-", "");
  const formattedEndDate = endDate.replaceAll("-", "");
  const url = `${BASE_URL}/games?dates=${formattedStartDate},${formattedEndDate}&ordering=-metacritic&page_size=10&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch games.");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching games by date range:", error);
    return [];
  }
}

export async function fetchGamesByMetacriticScore(minScore, maxScore) {
  const url = `${BASE_URL}/games?metacritic=${minScore},${maxScore}&page_size=20&ordering=-metacritic,name&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch games.");
    const { results } = await response.json();
    return results;
  } catch (error) {
    console.error("Error fetching games by Metacritic score:", error);
    throw error;
  }
}
