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