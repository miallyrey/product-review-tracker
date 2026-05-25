import { useState } from "react";

const emptyForm = {
  product_name: "",
  category: "",
  brand_name: "",
  status_received: false,
  status_reviewed: false,
  status_posted_instagram: false,
  status_posted_tiktok: false,
  status_posted_youtube: false,
  sponsorship_status: "",
  rating: "",
  notes: "",
  date_received: "",
  review_deadline: "",
};

function toPayload(form) {
  return {
    product_name: form.product_name,
    category: form.category || null,
    brand_name: form.brand_name || null,
    status_received: form.status_received,
    status_reviewed: form.status_reviewed,
    status_posted_instagram: form.status_posted_instagram,
    status_posted_tiktok: form.status_posted_tiktok,
    status_posted_youtube: form.status_posted_youtube,
    sponsorship_status: form.sponsorship_status || null,
    rating: form.rating === "" ? null : Number(form.rating),
    notes: form.notes || null,
    date_received: form.date_received || null,
    review_deadline: form.review_deadline || null,
  };
}

function fromProduct(product) {
  if (!product) return { ...emptyForm };
  return {
    product_name: product.product_name || "",
    category: product.category || "",
    brand_name: product.brand_name || "",
    status_received: product.status_received,
    status_reviewed: product.status_reviewed,
    status_posted_instagram: product.status_posted_instagram,
    status_posted_tiktok: product.status_posted_tiktok,
    status_posted_youtube: product.status_posted_youtube,
    sponsorship_status: product.sponsorship_status || "",
    rating: product.rating ?? "",
    notes: product.notes || "",
    date_received: product.date_received || "",
    review_deadline: product.review_deadline || "",
  };
}

export default function ProductForm({ initialProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(fromProduct(initialProduct));

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(toPayload(form));
  }

  const checkboxes = [
    ["status_received", "Received"],
    ["status_reviewed", "Reviewed"],
    ["status_posted_instagram", "Posted Instagram"],
    ["status_posted_tiktok", "Posted TikTok"],
    ["status_posted_youtube", "Posted YouTube"],
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">
        {initialProduct ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Product Name *
          <input
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Brand
          <input
            name="brand_name"
            value={form.brand_name}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Category
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. keyboard, headphones"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Sponsorship Status
          <select
            name="sponsorship_status"
            value={form.sponsorship_status}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">—</option>
            <option value="gifted">Gifted</option>
            <option value="sponsored">Sponsored</option>
            <option value="affiliate">Affiliate</option>
            <option value="purchased">Purchased</option>
          </select>
        </label>
        <label className="block text-sm">
          Date Received
          <input
            type="date"
            name="date_received"
            value={form.date_received}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Review Deadline
          <input
            type="date"
            name="review_deadline"
            value={form.review_deadline}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Rating (0–5)
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm">
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </label>

      <div className="flex flex-wrap gap-4">
        {checkboxes.map(([name, label]) => (
          <label key={name} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              checked={form[name]}
              onChange={handleChange}
              className="rounded"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
