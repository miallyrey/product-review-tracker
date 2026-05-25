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
