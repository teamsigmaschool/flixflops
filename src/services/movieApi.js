const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const API_KEY = String(import.meta.env.TMDB_API_KEY || "").trim();
const USE_BEARER = API_KEY.startsWith("eyJ");

export const hasApiKey = API_KEY.length > 0;

async function request(path, params = {}) {
  if (!hasApiKey) {
    throw new Error("Missing TMDB API key.");
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const headers = { accept: "application/json" };
  if (USE_BEARER) {
    headers.Authorization = `Bearer ${API_KEY}`;
  } else {
    url.searchParams.set("api_key", API_KEY);
  }

  let response;
  try {
    response = await fetch(url, { headers });
  } catch {
    throw new Error("Cannot reach TMDB. Check your connection.");
  }

  if (response.status === 401) {
    throw new Error("TMDB rejected this API key.");
  }
  if (response.status === 404) {
    throw new Error("That title is not on TMDB.");
  }
  if (response.status === 429) {
    throw new Error("Too many requests. Try again shortly.");
  }
  if (!response.ok) {
    throw new Error(`TMDB responded with ${response.status}.`);
  }

  return response.json();
}

export function getImageUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title || movie.name || "Untitled",
    overview: movie.overview || "",
    posterPath: movie.poster_path || null,
    backdropPath: movie.backdrop_path || null,
    releaseDate: movie.release_date || "",
    rating: Math.round((movie.vote_average || 0) * 10) / 10,
    voteCount: movie.vote_count || 0,
  };
}

function normalizeList(payload) {
  return {
    results: (payload.results || []).map(normalizeMovie),
    page: payload.page || 1,
    totalPages: Math.min(payload.total_pages || 1, 500),
    totalResults: payload.total_results || 0,
  };
}

export async function getPopularMovies(page = 1) {
  return normalizeList(await request("/movie/popular", { page }));
}

export async function searchMovies(query, page = 1) {
  const trimmed = query.trim();
  if (!trimmed) return { results: [], page: 1, totalPages: 1, totalResults: 0 };
  return normalizeList(
    await request("/search/movie", {
      query: trimmed,
      page,
      include_adult: false,
    }),
  );
}

export async function getMovieDetails(movieId) {
  const payload = await request(`/movie/${movieId}`, {
    append_to_response: "credits",
  });
  const credits = payload.credits || {};

  return {
    ...normalizeMovie(payload),
    tagline: payload.tagline || "",
    runtime: payload.runtime || 0,
    status: payload.status || "",
    genres: (payload.genres || []).map((genre) => genre.name),
    director:
      (credits.crew || []).find((person) => person.job === "Director")?.name ||
      "",
    cast: [...(credits.cast || [])]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10)
      .map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character || "",
        profilePath: person.profile_path || null,
      })),
  };
}
