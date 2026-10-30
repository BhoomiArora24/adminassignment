import { create } from "zustand";
import { getJson, isFresh, PAGE_SIZE } from "@/lib/api";

// Why Zustand: tiny API, no provider/boilerplate, async actions are just functions, selectors limit re-renders.
// Cache: in-memory, keyed by "query|limit|skip", expires after CACHE_TTL_MS. Failures are never cached.
const norm = (q) => q.trim().toLowerCase();
const keyOf = (q, page) => `${norm(q)}|${PAGE_SIZE}|${page * PAGE_SIZE}`;
let inflight = null;

export const useUsersStore = create((set, get) => ({
  items: [], total: 0, loading: true, error: null, q: "", page: 0, cache: {}, details: {},
  setQuery: (q) => set({ q, page: 0 }), // new query always resets pagination
  setPage: (page) => set({ page }),
  fetchUsers: async (force = false) => {
    const { q, page, cache } = get();
    const key = keyOf(q, page), hit = cache[key];
    if (!force && isFresh(hit)) return set({ items: hit.items, total: hit.total, loading: false, error: null });
    if (!force && inflight === key) return; // dedupe identical in-flight request
    inflight = key; set({ loading: true, error: null });
    const skip = page * PAGE_SIZE, query = norm(q);
    try {
      const d = await getJson(`${query ? `/users/search?q=${encodeURIComponent(query)}&` : "/users?"}limit=${PAGE_SIZE}&skip=${skip}`);
      const cur = get();
      set({ cache: { ...cur.cache, [key]: { items: d.users, total: d.total, at: Date.now() } } });
      if (keyOf(cur.q, cur.page) === key) set({ items: d.users, total: d.total, loading: false }); // ignore stale responses
    } catch (e) {
      if (keyOf(get().q, get().page) === key) set({ error: e.message, loading: false });
    } finally { if (inflight === key) inflight = null; }
  },
  fetchUser: async (id) => {
    const hit = get().details[id];
    if (isFresh(hit)) return hit.data;
    const data = await getJson(`/users/${encodeURIComponent(id)}`);
    set((s) => ({ details: { ...s.details, [id]: { data, at: Date.now() } } }));
    return data;
  },
}));
