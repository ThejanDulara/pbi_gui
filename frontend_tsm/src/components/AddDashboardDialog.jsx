import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createDashboard } from "../api/client";

export default function AddDashboardDialog({ open, onClose, options, onCreated, user }) {
  const [form, setForm] = useState({
    category: "",
    client: "",
    data_from: "",
    data_to: "",
    created_by: "",
    last_updated_date: "",
    updated_by: "",
    published_account: "",
    topic: "",
    description: "",
    link: "",
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const canSave = useMemo(
    () => Object.values(form).every((v) => String(v).trim().length > 0),
    [form]
  );

  useEffect(() => {
    if (open) {
      setErr("");
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setErr("");

    if (!canSave) {
      setErr("Please fill all fields.");
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        user_id: user?.userId || "",
        user_first_name: user?.firstName || "",
        user_last_name: user?.lastName || ""
      };

      const res = await createDashboard(payload);
      if (!res.ok) {
        const msg = res.error || "Failed to add dashboard";
        setErr(msg);
        toast.error(msg);
        return;
      }

      toast.success("Dashboard added successfully!");
      onCreated?.();
      onClose();
    } catch {
      setErr("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.backdrop} onMouseDown={onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        {/* ===== HEADER ===== */}
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>Add Dashboard</div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ===== ERROR ===== */}
        {err && <div style={styles.errorBox}>{err}</div>}

        {/* ===== FORM ===== */}
        <div style={styles.formContent}>
          <div style={styles.formRow}>
            <Field label="Category" required>
              <input list="categories" style={styles.input}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              />
              <datalist id="categories">
                {(options.categories || []).map(x => <option key={x} value={x} />)}
              </datalist>
            </Field>

            <Field label="Client" required>
              <input list="clients" style={styles.input}
                value={form.client}
                onChange={(e) => setField("client", e.target.value)}
              />
              <datalist id="clients">
                {(options.clients || []).map(x => <option key={x} value={x} />)}
              </datalist>
            </Field>
          </div>

          <div style={styles.formRow}>
            <Field label="Created By" required>
              <input list="created_bys" style={styles.input}
                value={form.created_by}
                onChange={(e) => setField("created_by", e.target.value)}
              />
              <datalist id="created_bys">
                {(options.created_bys || []).map(x => <option key={x} value={x} />)}
              </datalist>
            </Field>

            <Field label="Updated By" required>
              <input
                list="updated_bys"
                style={styles.input}
                value={form.updated_by}
                onChange={(e) => setField("updated_by", e.target.value)}
              />
              <datalist id="updated_bys">
                {(options.updated_bys || []).map(x => (
                  <option key={x} value={x} />
                ))}
              </datalist>
            </Field>

          </div>

          <Field label="Published Account (Email)" required>
            <input
              type="email"
              list="published_accounts"
              style={styles.input}
              value={form.published_account}
              onChange={(e) => setField("published_account", e.target.value)}
            />
            <datalist id="published_accounts">
              {(options.published_accounts || []).map(x => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </Field>


          <div style={styles.formRow}>
            <Field label="Last Updated Date" required>
              <input type="date" style={styles.input}
                value={form.last_updated_date}
                onChange={(e) => setField("last_updated_date", e.target.value)}
              />
            </Field>

            <Field label="Topic" required>
              <input style={styles.input}
                value={form.topic}
                onChange={(e) => setField("topic", e.target.value)}
              />
            </Field>
          </div>
          <div style={styles.formRow}>

            <Field label="Data From" required>
              <input
                type="date"
                style={styles.input}
                value={form.data_from}
                onChange={(e) => setField("data_from", e.target.value)}
              />
            </Field>

            <Field label="Data To" required>
              <input
                type="date"
                style={styles.input}
                value={form.data_to}
                onChange={(e) => setField("data_to", e.target.value)}
              />
            </Field>
          </div>


          <Field label="Description" required>
            <textarea style={styles.textarea}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>

          <Field label="Dashboard Link" required>
            <input style={styles.input}
              value={form.link}
              onChange={(e) => setField("link", e.target.value)}
            />
          </Field>
        </div>

        {/* ===== FOOTER ===== */}
        <div style={styles.modalFooter}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.submitBtn} onClick={submit} disabled={saving}>
            {saving ? "Adding..." : "Add Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Shared Styles (same feel as Update dialog) ===== */
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: 700,

    /* 🔥 IMPORTANT FIX */
    maxHeight: "90vh",          // never exceed viewport
    display: "flex",
    flexDirection: "column",

    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "24px 32px",
    background: "linear-gradient(135deg, #3182ce, #2c5282)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
  },
  modalTitle: { fontSize: 22, fontWeight: 800 },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
  },
  errorBox: {
    margin: 20,
    padding: 16,
    background: "#fff5f5",
    border: "2px solid #fed7d7",
    color: "#c53030",
    borderRadius: 12,
    fontWeight: 600,
  },
  formContent: {
    padding: 32,
    overflowY: "auto",   // 🔥 allow scrolling
    flex: 1,             // 🔥 take remaining height
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 20,
  },
  input: {
    padding: "14px 16px",
    borderRadius: 12,
    border: "2px solid #e2e8f0",
    fontSize: 14,
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: 12,
    border: "2px solid #e2e8f0",
    minHeight: 100,
  },
  modalFooter: {
    padding: "24px 32px",
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    padding: "14px 24px",
    borderRadius: 12,
    border: "2px solid #e2e8f0",
    background: "#fff",
  },
  submitBtn: {
    padding: "14px 28px",
    borderRadius: 12,
    border: "none",
    background: "#3182ce",
    color: "white",
    fontWeight: 700,
  },
};

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontWeight: 700 }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </div>
      {children}
    </div>
  );
}
