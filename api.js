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
