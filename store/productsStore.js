import { create } from "zustand";
import { getJson, isFresh, PAGE_SIZE } from "@/lib/api";

// Search and category are mutually exclusive: DummyJSON has no endpoint combining them, so choosing one clears the other.
const norm = (q) => q.trim().toLowerCase();
const keyOf = (q, c, page) => `${norm(q)}|${c}|${PAGE_SIZE}|${page * PAGE_SIZE}`;
let inflight = null;

export const useProductsStore = create((set, get) => ({
  items: [], total: 0, loading: true, error: null, q: "", category: "", page: 0, categories: [], cache: {}, details: {},
  setQuery: (q) => set({ q, page: 0, category: q.trim() ? "" : get().category }),
  setCategory: (category) => set({ category, q: "", page: 0 }),
  setPage: (page) => set({ page }),
  fetchCategories: async () => {
    if (get().categories.length) return;
    try { const list = await getJson("/products/category-list"); set({ categories: list }); } catch { /* dropdown stays empty; list still works */ }
  },
  fetchProducts: async (force = false) => {
    const { q, category, page, cache } = get();
    const key = keyOf(q, category, page), hit = cache[key];
    if (!force && isFresh(hit)) return set({ items: hit.items, total: hit.total, loading: false, error: null });
    if (!force && inflight === key) return;
    inflight = key; set({ loading: true, error: null });
    const paging = `limit=${PAGE_SIZE}&skip=${page * PAGE_SIZE}`, query = norm(q);
    const path = category ? `/products/category/${encodeURIComponent(category)}?${paging}` : query ? `/products/search?q=${encodeURIComponent(query)}&${paging}` : `/products?${paging}`;
    try {
      const d = await getJson(path);
      const cur = get();
      set({ cache: { ...cur.cache, [key]: { items: d.products, total: d.total, at: Date.now() } } });
      if (keyOf(cur.q, cur.category, cur.page) === key) set({ items: d.products, total: d.total, loading: false });
    } catch (e) {
      const c = get();
      if (keyOf(c.q, c.category, c.page) === key) set({ error: e.message, loading: false });
    } finally { if (inflight === key) inflight = null; }
  },
  fetchProduct: async (id) => {
    const hit = get().details[id];
    if (isFresh(hit)) return hit.data;
    const data = await getJson(`/products/${encodeURIComponent(id)}`);
    set((s) => ({ details: { ...s.details, [id]: { data, at: Date.now() } } }));
    return data;
  },
}));
