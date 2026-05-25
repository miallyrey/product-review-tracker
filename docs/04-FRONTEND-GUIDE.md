# Frontend Guide (React) — Concepts

> **Build the UI:** [labs/week-01/02-frontend-lab.md](./labs/week-01/02-frontend-lab.md)

## Philosophy

This frontend is intentionally **simple**:

- No Redux, Zustand, or React Query
- One `App.jsx` holds state with `useState` + `useEffect`
- Small presentational components

**Goal:** "Professional beginner project" — clean, not overengineered.

## File Map

| File | Purpose |
|------|---------|
| `src/main.jsx` | Mounts React to `#root` |
| `src/App.jsx` | Main page: list, form toggle, stats |
| `src/api.js` | All `fetch()` calls to backend |
| `src/components/ProductForm.jsx` | Create/edit form |
| `src/components/ProductCard.jsx` | Single product display |
| `src/components/StatusBadge.jsx` | Green/gray status pill |

## Data Flow

```
App.jsx
  ├─ useEffect → fetchProducts() → setProducts
  ├─ ProductForm → onSubmit → createProduct / updateProduct
  └─ ProductCard → onEdit / onDelete
```

## Tailwind Basics

Classes are utility-first:

- `rounded-lg border bg-white p-5 shadow-sm` — card style
- `bg-indigo-600 text-white` — primary button
- `grid sm:grid-cols-2` — responsive layout

**Learn:** No separate CSS files except `index.css` for Tailwind directives.

## Vite Proxy (Development)

`vite.config.js` proxies `/api` → `localhost:8000`. So `api.js` uses `""` as base URL and paths like `/api/products`.

## Production Build

```bash
cd frontend
npm run build
# Output in dist/ — served by nginx in Docker
```

## Beginner Experiments

1. Change header color: edit `className` in `App.jsx`
2. Add a "filter by category" dropdown (easy challenge)
3. Add dark mode with `dark:` Tailwind classes (medium)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| API URL wrong in production | Set `VITE_API_URL` at build time or use nginx proxy |
| Form doesn't reset | `ProductForm` uses `initialProduct` prop |
| Checkbox state wrong | Use `type="checkbox"` and `checked={form[name]}` |
