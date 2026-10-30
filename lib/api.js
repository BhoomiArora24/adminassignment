export const API = "https://dummyjson.com";
export const PAGE_SIZE = 10;
export const CACHE_TTL_MS = 60_000; // list cache expiry
export const isFresh = (entry) => !!entry && Date.now() - entry.at < CACHE_TTL_MS;
export async function getJson(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(res.status === 404 ? "Not found" : `Request failed (${res.status})`);
  return res.json();
}
export const titleCase = (s = "") => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
