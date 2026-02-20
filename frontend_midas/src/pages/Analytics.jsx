import React, { useEffect, useState } from "react";
import { getDashboards, getOptions } from "../api/client";

/**
 * Analytics Page
 * - Same filters as DashboardsPage
 * - Simple analytics table (Topic | Data From | Data To)
 */
export default function Analytics() {
  const [options, setOptions] = useState({
    categories: [],
    clients: [],
    created_bys: [],
  });

  const [filters, setFilters] = useState({
    category: "",
    client: "",
    created_by: "",
  });

  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Load dropdown options ---------- */
  const loadOptions = async () => {
    const opt = await getOptions();
    if (opt.ok) setOptions(opt);
  };

  /* ---------- Load dashboards (filtered) ---------- */
  const loadDashboards = async () => {
    setLoading(true);
    const res = await getDashboards({ ...filters, search });
    if (res.ok) setItems(res.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    loadDashboards();
  }, [filters.category, filters.client, filters.created_by, search]);

  const clearFilters = () =>
    setFilters({ category: "", client: "", created_by: "" });

  return (
    <section style={S.pageWrapper}>
      <div style={S.pageInner}>
        {/* ===== HEADER ===== */}
        <div style={S.headerCard}>
          <div>
            <h1 style={S.title}>Analytics</h1>
            <p style={S.subtitle}>
              Dashboard data coverage overview
            </p>
          </div>
        </div>

        {/* ===== FILTERS ===== */}
        <div style={S.filtersCard}>
          <div style={S.filtersGrid}>
            <FilterInput
              label="Search"
              value={search}
              onChange={setSearch}
            />

            <FilterSelect
              label="Category"
              value={filters.category}
              onChange={(v) => setFilters((p) => ({ ...p, category: v }))}
              options={options.categories}
            />

            <FilterSelect
              label="Client"
              value={filters.client}
              onChange={(v) => setFilters((p) => ({ ...p, client: v }))}
              options={options.clients}
            />

            <FilterSelect
              label="Created By"
              value={filters.created_by}
              onChange={(v) =>
                setFilters((p) => ({ ...p, created_by: v }))
              }
              options={options.created_bys}
            />
          </div>

          <div style={S.filterFooter}>
            <button style={S.secondaryBtn} onClick={clearFilters}>
              Clear Filters
            </button>
            <span style={S.resultCount}>
              {loading ? "Loading..." : `${items.length} record(s)`}
            </span>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div style={S.tableCard}>
          {loading ? (
            <div style={S.emptyState}>Loading analytics...</div>
          ) : items.length === 0 ? (
            <div style={S.emptyState}>No data available.</div>
          ) : (
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Dashboard Topic</th>
                  <th style={S.th}>Data From</th>
                  <th style={S.th}>Data To</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id}>
                    <td style={S.td}>{d.topic}</td>
                    <td style={S.td}>{d.data_from}</td>
                    <td style={S.td}>{d.data_to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================== REUSABLE FILTER COMPONENTS ================== */

function FilterInput({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={S.filterLabel}>{label}</div>
      <input
        style={S.input}
        placeholder="Search dashboard..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={S.filterLabel}>{label}</div>
      <select
        style={S.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {(options || []).map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================== STYLES ================== */

const S = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#d5e9f7",
    padding: "32px 16px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  pageInner: { maxWidth: 1200, margin: "0 auto" },

  headerCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },

  title: { fontSize: 26, fontWeight: 800, margin: 0 },
  subtitle: { color: "#4a5568", marginTop: 6 },

  filtersCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  filterFooter: {
    marginTop: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    background: "#edf2f7",
    fontWeight: 700,
    borderBottom: "2px solid #e2e8f0",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#2d3748",
  },

  emptyState: {
    padding: 20,
    textAlign: "center",
    color: "#4a5568",
  },

  input: {
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #cbd5e0",
    outline: "none",
    fontSize: 14,
  },

  filterLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#2d3748",
  },

  secondaryBtn: {
    padding: "10px 14px",
    background: "#edf2f7",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },

  resultCount: {
    fontSize: 13,
    fontWeight: 700,
    color: "#4a5568",
  },
};
