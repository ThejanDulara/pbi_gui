const API_BASE = import.meta.env.VITE_API_BASE;

export async function getOptions() {
  const r = await fetch(`${API_BASE}/api/options`);
  return r.json();
}

export async function getDashboards(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.client) params.set("client", filters.client);
  if (filters.created_by) params.set("created_by", filters.created_by);
  if (filters.search) params.set("search", filters.search);


  const url = `${API_BASE}/api/dashboards${params.toString() ? `?${params}` : ""}`;
  const r = await fetch(url);
  return r.json();
}

export async function createDashboard(payload) {
  const r = await fetch(`${API_BASE}/api/dashboards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export async function updateDashboard(id, payload) {
  const r = await fetch(`${API_BASE}/api/dashboards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}
