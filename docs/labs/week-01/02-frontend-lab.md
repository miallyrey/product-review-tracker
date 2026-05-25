# Lab 02 — Frontend (React + Vite + Tailwind)

**Prerequisite:** [01-backend-lab.md](./01-backend-lab.md) complete — API running on port 8000.  
**Goal:** Build the UI manually, understanding what Vite generates vs what you write.  
**Time:** ~3–5 hours

---

## Checkpoint 0 — Scaffold with Vite (interactive CLI)

**RUN:**

```bash
cd product-review-tracker
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

**What Vite generated (understand, don't skip):**

| File / folder | Keep? | What it does |
|---------------|-------|--------------|
| `index.html` | Yes | HTML shell; loads `src/main.jsx` |
| `src/main.jsx` | Yes | Mounts React into `#root` |
| `src/App.jsx` | Replace | Default demo — you'll rewrite |
| `vite.config.js` | Edit | Dev server + proxy to API |
| `package.json` | Edit | Scripts: `dev`, `build`, `preview` |
| `node_modules/` | Auto | **Never edit** — from `npm install` |
| `public/` | Optional | Static assets (favicon) |

**TEST:**

```bash
npm run dev
```

**EXPECTED:** `Local: http://localhost:5173/` — default Vite+React page (not our app yet).

Stop with `Ctrl+C`.

---

## Checkpoint 1 — Add Tailwind CSS

**RUN:**

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**What `tailwindcss init -p` generated:**

- `tailwind.config.js` — **you will replace content**
- `postcss.config.js` — usually fine as-is

**FILE:** `frontend/tailwind.config.js`  
**PURPOSE:** Tell Tailwind which files contain class names.

**CODE:**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**FILE:** `frontend/postcss.config.js`  
**PURPOSE:** Runs Tailwind as a PostCSS plugin.

**CODE:**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**FILE:** `frontend/src/index.css`  
**PURPOSE:** Imports Tailwind layers (replace Vite default CSS).

**CODE:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**FILE:** `frontend/src/main.jsx` — ensure it imports `./index.css` (Vite template usually does).

---

## Checkpoint 2 — Vite proxy to backend

**FILE:** `frontend/vite.config.js`  
**PURPOSE:** During dev, browser calls `/api` on port 5173; Vite forwards to FastAPI on 8000 (avoids CORS).

**CODE:**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

**EXPLANATION:** Without proxy, browser would need full URL `http://localhost:8000/api/...` and CORS setup is stricter.

---

## Checkpoint 3 — Update package.json

**FILE:** `frontend/package.json`  
**PURPOSE:** Pin dependencies (match or merge with your Vite-generated file).

**CODE:**

```json
{
  "name": "product-review-tracker-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.5"
  }
}
```

**RUN:** `npm install`

---

## Checkpoint 4 — HTML shell

**FILE:** `frontend/index.html`  
**PURPOSE:** Page title and body classes.

**CODE:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Product Review Tracker</title>
  </head>
  <body class="bg-slate-50 text-slate-900">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Checkpoint 5 — API helper

**FILE:** `frontend/src/api.js`  
**PURPOSE:** All HTTP calls in one place (beginners: no React Query yet).

**CODE:**

```javascript
const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function fetchProducts() {
  return request("/api/products");
}

export function createProduct(data) {
  return request("/api/products", { method: "POST", body: JSON.stringify(data) });
}

export function updateProduct(id, data) {
  return request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: "DELETE" });
}
```

**RUN:** (after App exists) — tested in Checkpoint 9.

---

## Checkpoint 6 — Small components

**RUN:** `mkdir -p frontend/src/components`

**FILE:** `frontend/src/components/StatusBadge.jsx`  

**CODE:**

```jsx
export default function StatusBadge({ label, active }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}: {active ? "Yes" : "No"}
    </span>
  );
}
```

**FILE:** `frontend/src/components/ProductCard.jsx`  

**CODE:**

```jsx
import StatusBadge from "./StatusBadge.jsx";

export default function ProductCard({ product, onEdit, onDelete }) {
  const deadline = product.review_deadline
    ? new Date(product.review_deadline)
    : null;
  const isOverdue =
    deadline && deadline < new Date() && !product.status_reviewed;

  return (
    <article className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{product.product_name}</h3>
          <p className="text-sm text-slate-600">
            {product.brand_name || "Unknown brand"}
            {product.category ? ` · ${product.category}` : ""}
          </p>
          {product.sponsorship_status && (
            <span className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
              {product.sponsorship_status}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="rounded border px-3 py-1 text-sm hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="rounded border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge label="Received" active={product.status_received} />
        <StatusBadge label="Reviewed" active={product.status_reviewed} />
        <StatusBadge label="IG" active={product.status_posted_instagram} />
        <StatusBadge label="TikTok" active={product.status_posted_tiktok} />
        <StatusBadge label="YouTube" active={product.status_posted_youtube} />
      </div>

      <div className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
        {product.rating != null && <p>Rating: {product.rating} / 5</p>}
        {product.date_received && <p>Received: {product.date_received}</p>}
        {product.review_deadline && (
          <p className={isOverdue ? "font-medium text-red-600" : ""}>
            Deadline: {product.review_deadline}
            {isOverdue ? " (overdue)" : ""}
          </p>
        )}
      </div>

      {product.notes && (
        <p className="mt-3 rounded bg-slate-50 p-3 text-sm text-slate-700">
          {product.notes}
        </p>
      )}
    </article>
  );
}
```

**FILE:** `frontend/src/components/ProductForm.jsx`  

**CODE:** See [02-frontend-lab-PRODUCT-FORM.md](./02-frontend-lab-PRODUCT-FORM.md) (full 211-line file — paste in one step).

---

## Checkpoint 7 — Main App

**FILE:** `frontend/src/App.jsx`  
**PURPOSE:** Page layout, state, list + form toggles.

**CODE:** See [02-frontend-lab-APP.md](./02-frontend-lab-APP.md) (full file).

**EXPLANATION highlights:**

- `useState` — products list, loading, error, which form is open
- `useEffect` — load products on mount
- No Redux — intentional simplicity

---

## Checkpoint 8 — Entry point

**FILE:** `frontend/src/main.jsx`

**CODE:**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Delete Vite boilerplate files you no longer need: `src/App.css`, `src/assets/react.svg` (optional cleanup).

---

## Checkpoint 9 — End-to-end test

**Terminal 1 — API:**

```bash
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — UI:**

```bash
cd frontend && npm run dev
```

**EXPECTED:**

1. http://localhost:5173 shows Product Review Tracker header
2. **+ Add Product** works
3. Product appears in list
4. Edit / Delete work
5. Stats cards update counts

**MISTAKES:**

| Symptom | Fix |
|---------|-----|
| `Failed to fetch` | Backend not running |
| CORS error | Use Vite proxy — API_BASE should be `""` in dev |
| Blank page | Check browser console for JSX typo |

---

## Lab Complete ✓

**Next:** [Week 2 — Docker](../week-02/03-docker-lab.md)

**Concept guide:** [04-FRONTEND-GUIDE.md](../../04-FRONTEND-GUIDE.md)

Full `App.jsx` and `ProductForm.jsx` are in the lab appendices linked above — paste from there, not from `reference/`, until you need to debug.
