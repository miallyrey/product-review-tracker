# Appendix — Full `App.jsx`

**FILE:** `frontend/src/App.jsx`

```jsx
import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "./api.js";
import ProductCard from "./components/ProductCard.jsx";
import ProductForm from "./components/ProductForm.jsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(payload) {
    await createProduct(payload);
    setShowForm(false);
    await loadProducts();
  }

  async function handleUpdate(payload) {
    await updateProduct(editing.id, payload);
    setEditing(null);
    await loadProducts();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    await loadProducts();
  }

  const pendingReview = products.filter(
    (p) => p.status_received && !p.status_reviewed
  ).length;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Product Review Tracker</h1>
          <p className="mt-1 text-slate-600">
            Track products from brands — reviews, deadlines, and social posts.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Pending Review</p>
            <p className="text-2xl font-bold">{pendingReview}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Fully Posted</p>
            <p className="text-2xl font-bold">
              {
                products.filter(
                  (p) =>
                    p.status_posted_instagram ||
                    p.status_posted_tiktok ||
                    p.status_posted_youtube
                ).length
              }
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {error}. Is the API running on port 8000?
          </div>
        )}

        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Add Product
          </button>
        )}

        {showForm && (
          <div className="mb-8">
            <ProductForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {editing && (
          <div className="mb-8">
            <ProductForm
              initialProduct={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="rounded-lg border border-dashed bg-white p-8 text-center text-slate-500">
            No products yet. Add your first review item!
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

Return to [02-frontend-lab.md](./02-frontend-lab.md).
