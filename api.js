const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec";
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGames(ordering, page_size) {
  const url = `${BASE_URL}/games?key=${API_KEY}&ordering=${ordering}&page_size=${page_size}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}
