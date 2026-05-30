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