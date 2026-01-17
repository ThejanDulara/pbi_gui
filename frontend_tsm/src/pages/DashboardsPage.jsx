import React, { useEffect, useState } from "react";
import AddDashboardDialog from "../components/AddDashboardDialog";
import UpdateDashboardDialog from "../components/UpdateDashboardDialog";
import { getDashboards, getOptions } from "../api/client";

export default function DashboardsPage() {
  const [options, setOptions] = useState({ categories: [], clients: [], created_bys: [] });
  const [filters, setFilters] = useState({ category: "", client: "", created_by: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [search, setSearch] = useState("");

  const loadOptions = async () => {
    const opt = await getOptions();
    if (opt.ok) setOptions(opt);
  };

  const loadDashboards = async () => {
    setLoading(true);
    const list = await getDashboards({ ...filters, search });
    if (list.ok) setItems(list.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    loadDashboards();
  }, [filters.category, filters.client, filters.created_by, search]);

  const clearFilters = () => setFilters({ category: "", client: "", created_by: "" });

  return (
    <section style={R.pageWrapper}>
      <div style={R.pageInner}>

        {/* ===== HEADER ===== */}
        <div style={R.headerCard}>
          <div>
            <h1 style={R.title}>Power BI Dashboards</h1>
            <p style={R.subtitle}>
              Centralized library of Power BI dashboards with smart filtering.
            </p>
          </div>
          <button style={R.primaryBtn} onClick={() => setDialogOpen(true)}>
            + Add Dashboard
          </button>
        </div>

        {/* ===== FILTERS ===== */}
        <div style={R.filtersCard}>
          <div style={R.filtersGrid}>
            <FilterInput
              label="Search"
              value={search}
              onChange={setSearch}
            />

            <FilterSelect
              label="Category"
              value={filters.category}
              onChange={(v) => setFilters(p => ({ ...p, category: v }))}
              options={options.categories}
            />

            <FilterSelect
              label="Client"
              value={filters.client}
              onChange={(v) => setFilters(p => ({ ...p, client: v }))}
              options={options.clients}
            />

            <FilterSelect
              label="Created By"
              value={filters.created_by}
              onChange={(v) => setFilters(p => ({ ...p, created_by: v }))}
              options={options.created_bys}
            />
          </div>

          <div style={R.filterFooter}>
            <button style={R.secondaryBtn} onClick={clearFilters}>
              Clear Filters
            </button>
            <span style={R.resultCount}>
              {loading ? "Loading..." : `${items.length} dashboard(s)`}
            </span>
          </div>
        </div>

        {/* ===== DASHBOARD LIST ===== */}
        <div style={R.cardsGrid}>
          {loading ? (
            <div style={R.emptyCard}>Loading dashboards...</div>
          ) : items.length === 0 ? (
            <div style={R.emptyCard}>No dashboards found.</div>
          ) : (
            items.map((d) => (
              <DashboardCard
                key={d.id}
                d={d}
                onEdit={() => {
                  setSelectedDashboard(d);
                  setEditOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* ===== DIALOGS ===== */}
      <AddDashboardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        options={options}
        onCreated={loadDashboards}
        styles={R}
      />

      <UpdateDashboardDialog
        open={editOpen}
        dashboard={selectedDashboard}
        onClose={() => setEditOpen(false)}
        onUpdated={loadDashboards}
        styles={R}
      />
    </section>
  );
}

/* ===== COMPONENTS ===== */

function FilterInput({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={R.filterLabel}>{label}</div>
      <input
        style={R.input}
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
      <div style={R.filterLabel}>{label}</div>
      <select style={R.input} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {(options || []).map((x) => (
          <option key={x} value={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}

function DashboardCard({ d, onEdit }) {
  return (
    <div style={R.card}>
      <div style={R.cardHeader}>
        <h3 style={R.cardTitle}>{d.topic}</h3>
        <div style={R.badges}>
          <span style={R.badge}>{d.category}</span>
          <span style={R.badge}>{d.client}</span>
        </div>
      </div>

      <div style={R.cardBody}>
        <p style={R.desc}>{d.description}</p>

        <div style={R.metaGrid}>
          <Meta label="Created By" value={d.created_by} />
          <Meta label="Updated By" value={d.updated_by} />
          <Meta label="Last Updated" value={d.last_updated_date} />
        </div>
      </div>

      <div style={R.cardFooter}>
        <span style={R.link}>{d.link}</span>

        <div style={R.actions}>
          <button style={R.secondaryBtnSmall} onClick={onEdit}>
            Update
          </button>
          <button
            style={R.primaryBtnSmall}
            onClick={() => window.open(d.link, "_blank", "noopener,noreferrer")}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5568" }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}

/* ===== STYLES (ProgramSelector-inspired) ===== */

const R = {
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
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
    flexWrap: "wrap",
    gap: 10,
  },

  cardsGrid: { display: "grid", gap: 16 },

  card: {
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  cardHeader: {
    padding: 16,
    background: "#edf2f7",
  },

  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },

  badges: {
    marginTop: 8,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  badge: {
    padding: "6px 12px",
    background: "#ffffff",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #cbd5e0",
  },

  cardBody: { padding: 16 },

  desc: {
    color: "#4a5568",
    lineHeight: 1.6,
    marginBottom: 12,
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },

  cardFooter: {
    padding: 16,
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },

  link: {
    fontSize: 12,
    color: "#4a5568",
    maxWidth: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  actions: { display: "flex", gap: 10 },

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

  primaryBtn: {
    padding: "14px 22px",
    background: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: 30,
    fontWeight: 700,
    cursor: "pointer",
  },

  primaryBtnSmall: {
    padding: "10px 16px",
    background: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: 30,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "12px 16px",
    background: "#edf2f7",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryBtnSmall: {
    padding: "10px 14px",
    background: "#edf2f7",
    border: "none",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  emptyCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    color: "#4a5568",
  },
  /* ===== MODAL FIX (REQUIRED) ===== */
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: 860,
    background: "#ffffff",
    borderRadius: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
    overflow: "hidden",
  },

  modalHeader: {
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#edf2f7",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: "#2c5282",
  },

  modalFooter: {
    padding: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    borderTop: "1px solid #e2e8f0",
  },

  iconBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    fontWeight: 900,
  },

  errorBox: {
    margin: 16,
    background: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#9b2c2c",
    padding: 12,
    borderRadius: 12,
    fontWeight: 700,
  },

};
